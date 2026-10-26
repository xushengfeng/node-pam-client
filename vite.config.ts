import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.test.ts"],
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "nodePamClient",
			fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			// 确保原生模块和 Node 内置模块被排除在打包之外
			external: [/^node:/, /\.node$/],
			output: {
				exports: "named",
			},
		},
	},
});
