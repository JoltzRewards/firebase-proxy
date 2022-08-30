import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("firestore");

export function getFirestore(app) {
	logger.log("creating firestore adapter");

	return {};
}

export function doc(db, table, key) {
	logger.log("doc", { db, table, key });
	
	return { table, key };
}

export function collection(db, name) {
	logger.log("collection", { db, name });
	
	return { collection };
}

export function where(db, a, compare, b) {
	logger.log("where", { db, a, compare, b });
	
	return { query: `${a} ${compare} ${b}` };
}

export function query(db) {
	const statments = statments.slice(1);

	logger.log("where", { db, query: statments });
	
	return { query: statments };
}

export async function setDoc(query, value) {
	logger.log("setting document", { query, value });
}

export async function updateDoc(query, value) {
	logger.log("updating document", { query, value });
}

class Document {
	constructor(query) {
		this.query = query;
	}

	exists() {
		logger.log("checking existence", { query });

		return false;
	}

	data() {
		logger.log("getting data", { query });

		return {};
	}
}

export async function getDoc(query) {
	logger.log("getting document", { query });

	return new Document(query);
}


export async function getDocs(query) {
	logger.log("getting documents", { query });

	return [new Document(query)];
}
