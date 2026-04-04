import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	root: __dirname,
	publicDir: path.resolve(__dirname, "public"),
	resolve: {
		alias: {
			sharp: path.resolve(__dirname, "sharp-stub.ts"),
		},
	},
	optimizeDeps: {
		exclude: ["sharp"],
	},
	server: {
		fs: {
			allow: [path.resolve(__dirname, "..")],
		},
	},
});
