import { NhostClient } from "@nhost/nhost-js";
import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("firestore");

export function initializeApp(configuration) {
	if (!window.nhost) {
		logger.log("creating new app adapter");

		window.nhost = new NhostClient({
			subdomain: localStorage.getItem("nhost-domain") || process.env.REACT_APP_NHOST_SUBDOMAIN || "localhost",
			region: localStorage.getItem("nhost-region") || process.env.REACT_APP_NHOST_REGION || null
		});
	}

	return window.nhost;
}

window.debug = {
	...{
		restart: initializeApp,
		setHost: function(domain, region) {
			localStorage.setItem("nhost-domain", domain);
			localStorage.setItem("nhost-region", region);

			initializeApp();
		}
	},
	...window.debug
}