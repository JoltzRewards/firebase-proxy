import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("storage");

export function getStorage(app) {
	logger.log("creating storage adapter");

	return {};
}

export function ref(storage, path) {
	logger.log("finding file at path", { path });
}

class Upload {
	constructor(reference, content) {
		this.reference = reference;
		this.content = content;
		this.snapshot = { ref: "" };
	}

	on(event, snapshot, error, done) {
		logger.log("file state watching", { event, snapshot, error, done });

		done();
	}
}

export function uploadBytesResumable(reference, content) {
	logger.log("uploading file", { reference, content });

	return new Upload(reference, content);
}

export async function getDownloadURL(reference) {
	logger.log("get download URL", { reference });

	return "https://www.example.com";
}

export async function listAll(reference) {
	logger.log("listing all files", { reference });

	return {
		items: [{
			_location: {
				path_: "example"
			}
		}]
	}
}

export async function deleteObject(reference) {
	logger.log("deleting object", { reference });
}
