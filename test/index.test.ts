import { describe, it, expect } from "vitest";
import { pam } from "../src/index";

describe("pam", () => {
	it("should be a function", () => {
		expect(typeof pam.service).toBe("function");
	});

	it("should return a PamService with authenticate method", () => {
		const service = pam.service("login");
		expect(typeof service.authenticate).toBe("function");
	});

	it("should authenticate correctly using environment variables", () => {
		const serviceName = process.env.PAM_SERVICE || "login";
		const username = process.env.PAM_USER;
		const password = process.env.PAM_PASS;

		// Only run this test if environment variables are provided
		if (username && password) {
			return new Promise<void>((resolve, reject) => {
				pam.service(serviceName).authenticate(username, password, (err) => {
					try {
						if (err) {
							reject(err);
						} else {
							// Using == null to match both null and undefined
							expect(err == null).toBe(true);
							resolve();
						}
					} catch (e) {
						reject(e);
					}
				});
			});
		} else {
			console.log(
				"Skipping authentication test because PAM_USER or PAM_PASS environment variables are not set.",
			);
			expect(true).toBe(true);
		}
	}, 3000);
});
