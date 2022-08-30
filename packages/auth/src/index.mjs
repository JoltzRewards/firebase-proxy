import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("auth");

export function getAuth(app) {
	logger.log("creating auth adapter");

	return {};
}

export function sendSignInLinkToEmail(auth, email, settings) {
	logger.log("sending sign in link", { auth, email, settings });
}

export function signOut(auth) {
	logger.log("signing out", { auth });
}

export function onAuthStateChanged(auth, callback) {
	logger.log("handling state changes", { auth, callback });
}

// EMAIL_LINK_SIGN_IN_METHOD
export async function fetchSignInMethodsForEmail(auth, email) {
	logger.log("fetchSignInMethodsForEmail", { auth, email });

	return [];
}

export function isSignInWithEmailLink(auth, location) {
	logger.log("checking link", { auth, location });
	
	return false;
}

export async function signInWithEmailLink(auth, email, location) {
	logger.log("signing in with email", { auth, email, location });
}

export function getAdditionalUserInfo(query) {
	logger.log("getting additional user info", { query });

	return { isNewUser: true };
}