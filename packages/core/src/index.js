export class Logger {
	constructor(source) {
		this.source = source;
  	}

  	log() {
  		console.info(`${this.source}:`, ...arguments);
  	}
}