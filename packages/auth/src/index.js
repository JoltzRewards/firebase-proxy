import { gql } from "graphql-tag";
import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("auth");

export function getAuth(app) {
	logger.log("creating auth adapter");

	if (window.nhost) {
		window.nhost.auth.onAuthStateChanged((event, session) => {
			logger.log("auth state change", { event, session });

			if (session) {
				if (event === "SIGNED_IN" && localStorage.getItem("authentication_state") === "pending") {
					localStorage.setItem("authentication_state", "active");
				}
			} else {
				localStorage.setItem("authentication_state", "empty");
			}
		});
	}

	return {};
}

export function sendSignInLinkToEmail(auth, email, settings) {
	logger.log("sending sign in link", { auth, email, settings });

	window.nhost.auth.signIn({
		email,
		options: {
			redirectTo: settings ? settings.url : window.location.href
		}
	});

	// TRUBIT-specific
	localStorage.setItem("emailForSignIn", email);

	localStorage.setItem("authentication_state", "pending");
}

export function signOut(auth) {
	logger.log("signing out", { auth });
}

export function onAuthStateChanged(auth, callback) {
	if (window.nhost) {
		window.nhost.auth.onAuthStateChanged((event, session) => {
			if (session != null) {
				callback({
					user: {
						uid: session.user.id
					}
				});
			}
		});
	}

	logger.log("handling state changes");
}

export async function fetchSignInMethodsForEmail(auth, email) {
	logger.log("fetchSignInMethodsForEmail", { auth, email });

	if (!window.nhost) {
		logger.log("nhost has not started");

		return [];
	}

	const result = await window.nhost.graphql.request(gql`
		query CheckEmail($email: citext) {
			users(where: {email: {_eq: $email}}) {
				emailVerified
			}
		}
	`, { email });

	if (result.error || !result.data || !result.data.users[0]) {
		logger.log("user does not exist", { email });

		return [];
	}

	if (result.data.users[0].emailVerified === false) {
		logger.log("email is not verified", { email });

		return [];
	}

	logger.log("user exists and is verified", { email });

	return ["EMAIL_LINK_SIGN_IN_METHOD"];
}

export function isSignInWithEmailLink(auth, location) {
	const state = localStorage.getItem("authentication_state");

	logger.log("checking link", { auth, state, location });

	if (state === "active") {
		localStorage.setItem("authentication_state", "done");

		return true;
	}

	return false;
}

export async function signInWithEmailLink(auth, email, location) {
	logger.log("signing in with email", { auth, email, location });

	const isAuthenticated = await window.nhost.auth.isAuthenticatedAsync()

	if (isAuthenticated === false) {
		logger.log("user is not authenticated");
		return;
	}

	const user = await window.nhost.auth.getUser();

	logger.log("got user info", { user });

	return {
		user: {
			uid: user.id,
			email: email
		}
	}
}

export function getAdditionalUserInfo(query) {
	logger.log("getting additional user info", { query });

	return { isNewUser: true };
}