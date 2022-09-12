import { NhostClient } from "@nhost/nhost-js";
import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("firestore");

export function initializeApp(configuration) {
	if (!window.nhost) {
		logger.log("creating new app adapter");

		window.nhost = new NhostClient({
  			subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || "localhost",
  			region: process.env.REACT_APP_NHOST_REGION || null
		});
	}

	return window.nhost;
}