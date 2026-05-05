// Use the internal addon directly
const addon = require("../index.node");

export class PamService {
	private serviceName: string;

	constructor(serviceName: string) {
		this.serviceName = serviceName;
	}

	authenticate(
		username: string,
		password: string,
		callback: (err: Error | null) => void,
	): void {
		addon.authenticate(this.serviceName, username, password, callback);
	}
}

export const pam = {
	service: (serviceName: string): PamService => new PamService(serviceName),
};

export default { pam, loginService: new PamService("login") };
