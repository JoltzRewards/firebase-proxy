import { NhostClient } from "@nhost/nhost-js";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("firestore");

export function initializeApp(configuration) {
	if (!window.nhost) {
		logger.log("creating new app adapter");

		window.nhost = new NhostClient({
  			subdomain: 'localhost'
		});

		window.apollo = new ApolloClient({
			uri: window.nhost.graphql.getUrl(),
			cache: new InMemoryCache()
		});
	}

	return window.nhost;
}