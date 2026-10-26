// Use the internal addon directly
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// CJS 构建中 __filename 可用；ESM 中回退到 import.meta.url。
const require = createRequire(
	typeof __filename === "string" ? __filename : import.meta.url,
);

const packageRoot =
	typeof __dirname === "string"
		? join(__dirname, "..")
		: dirname(dirname(fileURLToPath(import.meta.url)));

const prebuilt = join(
	packageRoot,
	"prebuilds",
	`${process.platform}-${process.arch}`,
	"index.node",
);
const legacy = join(packageRoot, "index.node");

if (!existsSync(prebuilt) && !existsSync(legacy)) {
	throw new Error(
		`myde-pam-client: 没有 ${process.platform}-${process.arch} 的原生模块，请先运行 npm run build:rust`,
	);
}

const addon = require(existsSync(prebuilt) ? prebuilt : legacy);

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
