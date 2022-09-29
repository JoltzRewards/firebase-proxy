import { Logger } from "@trubittech/firebase-proxy-core";

export const logger = new Logger("storage");

export function getStorage(app) {
	logger.log("creating storage adapter");

	return {};
}

export function ref(storage, path) {
	logger.log("finding file at path", { path });

	return path;
}

class Upload {
	constructor(reference, content) {
		this.reference = reference;
		this.content = content;

		this.snapshot = { ref: null };
	}

	on(event, snapshot, error, done) {
		logger.log("file state watching", { event, snapshot, error, done });

		if (!window.nhost) {
			logger.log("failed to upload since nhost has not started", { reference: this.reference });

			error("nhost has not started");

			return;
		}

		window.nhost.storage.upload({ 
			file: this.content,
			name: this.reference
		})
		.then((result) => {
			if (result.error) {
				error(result.error);

				return;
			}

			this.snapshot.ref = result.fileMetadata.id;

			logger.log("uploaded with result", { reference: this.reference, result })

			done();

			return;
		});		
	}
}

export function uploadBytesResumable(reference, content) {
	logger.log("uploading file", { reference, content });

	return new Upload(reference, content);
}

export async function getDownloadURL(reference) {
	logger.log("get download URL", { reference });

	const publicURL = nhost.storage.getPublicUrl({ fileId: reference })

	logger.log("got download URL", { reference, publicURL });

	return publicURL;
}

export async function listAll(reference) {
	logger.log("listing all files", { reference });

	return {}
}

export async function deleteObject(reference) {
	logger.log("deleting object", { reference });
}
