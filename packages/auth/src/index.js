import { gql } from "@apollo/client";
import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("auth");

export function getAuth(app) {
	logger.log("creating auth adapter");

	return {};
}

export function sendSignInLinkToEmail(auth, email, settings) {
	logger.log("sending sign in link", { auth, email, settings });

	window.nhost.auth.signIn({ email });

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
			logger.log("auth state change", { event, session });

			if (session != null) {
				callback({
					user: {
						uid: session.user.id
					}
				})
			} else {
				localStorage.setItem("authentication_state", "empty");
			}
		});
	}

	logger.log("handling state changes");
}

export async function fetchSignInMethodsForEmail(auth, email) {
	logger.log("fetchSignInMethodsForEmail", { auth, email });

	if (!window.apollo) {
		logger.log("apollo has not started");

		return [];
	}

	const result = await window.apollo.query({ 
		query: gql`
		query CheckEmail($email: citext) {
			users(where: {email: {_eq: $email}}) {
				emailVerified
			}
		}`,
		variables: {
			email
		}
	});

	if (!result || !result.data || !result.data.users[0] ) {
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

	if (state === "pending") {
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
			uid: user.id
		}
	}
}

export function getAdditionalUserInfo(query) {
	logger.log("getting additional user info", { query });

	return { isNewUser: true };
}