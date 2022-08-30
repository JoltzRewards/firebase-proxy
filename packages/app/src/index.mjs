import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("firestore");

export function initializeApp(configuration) {
	logger.log("creating app adapter");

	return {};
}