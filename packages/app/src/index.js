import { NhostClient } from "@nhost/nhost-js";
import { Logger } from "@trubittech/firebase-proxy-core";

export const logger = new Logger("app");

export function initializeApp(configuration) {
	if (!window.nhost) {
		const state = {
			subdomain: configuration?.domain || import.meta.env.VITE_NHOST_SUBDOMAIN || "localhost",
			region: configuration?.region || import.meta.env.VITE_NHOST_REGION || null
		}

		logger.log("creating new app adapter", state);

		window.nhost = new NhostClient(state);
	}

	return window.nhost;
}
