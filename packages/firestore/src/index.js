import { gql } from "@apollo/client";
import { Logger } from "@firebase-proxy/core";

export const logger = new Logger("firestore");

export function getFirestore(app) {
	logger.log("creating firestore adapter");

	window.debug = {};
	window.debug.setDoc = setDoc;
	window.debug.getDoc = getDoc;

	return {};
}

class Statement {
	constructor(type, content) {
		this.type = type;
		this.content = content;
	}
}

export function doc(db, table, key) {
	logger.log("doc", { db, table, key });
	
	return new Statement("document", { table, key })
}

export function collection(db, name) {
	logger.log("collection", { db, name });
	
	return new Statement("collection", { name })
}

export function where(left, compare, right) {
	logger.log("where", { left, compare, right });
	
	return new Statement("where", { left, compare, right })
}

export function query() {
	const statments = [...arguments];

	logger.log("got statments", { query: statments });
	
	return statments;
}

export async function setDoc(query, value) {
	logger.log("setting document", { query, value });

	const mapping = schema.mapping[query.content.table];

	if (!mapping) {
		logger.log("failed to set document, no mapping", { query, value });

		return;
	}

	logger.log("found mapping", { mapping });

	if (!value[mapping.key]) {
		value[mapping.key] = query.content.key;
	}

	let mapped = {};

	for (var key in value) {
		if(mapping.fields[key]) {
			mapped[mapping.fields[key]] = value[key];
		}
	}

	logger.log("mapped values", { mapped });

	const result = await window.apollo.mutate({ 
	 	mutation: gql`
	 		mutation SetDoc($value: ${mapping.name}_insert_input!) {
				insert_${mapping.name}_one(object: $value) {
 					ID
				}
 			}
 		`,
		variables: {
			value: mapped
		}
	});

	logger.log("result", { result });
}

export async function updateDoc(query, value) {
	logger.log("updating document", { query, value });
}

class Document {
	constructor(query, content) {
		this.query = query;
		this.content = content;
	}

	exists() {
		logger.log("checking existence", { query: this.query, content: this.content });

		return this.content != null;
	}

	data() {
		logger.log("getting data", { query: this.query, content: this.content });

		return this.content;
	}
}

async function getDocuments(query) {
	if (!window.apollo) {
		logger.log("apollo has not started");

		return null;
	}

	let table;

	if (query instanceof Array) {
		for (var statement of query) {
			if (statement.type === "collection") {
				table = statement.content.name;
			}
		}
	} else {
		table = query.content.table;
	}

	if (!table) {
		logger.log("bad query", { query });

		return null;
	}

	const mapping = schema.mapping[table];

	if (!mapping) {
		logger.log("mapping not found", { table });

		return null;
	}

	logger.log("found mapping", { table, mapping });

	let where = {};

	if (query instanceof Array) {
		where._and = [];

		for (var statement of query) {
			if (statement.type === "where") {
				let comparison;

				switch (statement.content.compare) {
					case "==":
						comparison = "_eq";
						break;

					case "!=":
						comparison = "_neq";
						break;

					case ">":
						comparison = "_gt";
						break;

					case "<":
						comparison = "_lt";
						break;

					case "<=":
						comparison = "_gte";
						break;

					case ">=":
						comparison = "_lte";
						break;

					default:
						logger.log("can't find comparison conversion", { statement });

						return null;
				}

				where._and.push({
					[mapping.fields[statement.content.left]]: {
						[comparison]: statement.content.right
					}
				});
			}
		}
	} else {
		where[mapping.key] = { 
			_eq: query.content.key
		}
	}

	logger.log("got where statement", { where, query });

	const result = await window.apollo.query({ 
		query: gql`
			query GetDoc($where: ${mapping.name}_bool_exp) {
				${mapping.name}(where: $where) {
					${Object.values(mapping.fields).join("\n")}
				}
			}
		`,
		variables: { 
			where: where
		}
	});

	logger.log("got result", { result, query });

	if (result.data[mapping.name] && result.data[mapping.name].length > 0) {
		let all = [];

		for (var unmapped of result.data[mapping.name]) {
			let response = {};

			for (var key of Object.keys(mapping.fields)) {
				response[key] = unmapped[mapping.fields[key]];
			}

			logger.log("mapped response", { response, query, fields: mapping.fields, mess: unmapped  });

			all.push(new Document(query, response));
		}

		return all;
	}

	return null;
}

export async function getDoc(query) {
	logger.log("getting document", { query });

	const documents = await getDocuments(query);

	if (!documents || documents.length == 0) {
		logger.log("failed to find document", { query });

		return new Document(query, null);
	}
	
	return documents[0];
}

export async function getDocs(query) {
	logger.log("getting documents", { query });

	const documents = await getDocuments(query);

	if (!documents || documents.length == 0) {
		logger.log("failed to find documents", { query });

		return [];
	}

	documents.__proto__.size = documents.length;
	
	return documents;
}

// TODO: make into a configuration file
const schema = {
	"mapping": {
		"brands": {
			"name": "pilot_brands",
			"key": "name",
			"fields": {
				"id": "ID",
				"name": "name",
				"email": "owner",
				"subDomain": "domain"
			}
		},
		"users": {
			"name": "pilot_owners",
			"key": "email",
			"fields": {
				"firstName": "firstName",
				"lastName": "lastName",
				"email": "email",
				"companyName": "brandName",
				"brandId": "brandID",
				"subDomain": "domain"
			}
		},
		"campaigns": {
			"name": "pilot_campaigns",
			"key": "ID",
			"fields": {
				"slug": "slug",
				"name": "name",
				"tag": "tag",
				"description": "description",
				"assetType": "assetType",
				"imageUrl": "imageURL",
				"nftAudienceFileUrl": "NFTAudienceFileURL",
				"audienceSize": "audienceSize",
				"dateRange": "dateRange",
				"redirectURL": "redirectURL",
				"selectedAudience": "selectedAudience",
				"isRevealEnable": "isRevealEnable",
				"totalBudget": "totalBudget",
				"assetDescription": "assetDescription",
				"mintingLimit": "mintingLimit",
				"rewardAmount": "rewardAmount",
				"type": "type",
				"storageId": "storageID",
				"color": "color",
				"brand": "brandID"
			}
		},
		"transactions": {
			"name": "pilot_transactions",
			"key": "ID",
			"fields": {
				"ID": "ID",
				"user": "user",
				"campaign": "campaign"
			}
		}
	}
}
