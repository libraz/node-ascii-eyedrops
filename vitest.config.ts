import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["test/**/*.test.ts"],
		coverage: {
			include: ["src/**/*.ts"],
			exclude: [
				"src/ascii/adapter/canvas-adapter.ts",
				"src/types.ts",
				"src/util/base64.ts",
				"src/util/gzip.ts",
			],
		},
	},
});
