import { NhostClient } from "@nhost/nhost-js";
import { Logger } from "@trubittech/firebase-proxy-core";

export const logger = new Logger("firestore");

export function initializeApp(configuration) {
	if (!window.nhost) {
		logger.log("creating new app adapter");

		window.nhost = new NhostClient({
			subdomain: localStorage.getItem("nhost-domain") || "sspblsjcforgiuatmnbp",
			region: localStorage.getItem("nhost-region") || "us-east-1"
		});
	}

	return window.nhost;
}
