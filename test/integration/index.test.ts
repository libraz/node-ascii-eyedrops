import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { imageToAscii, transform } from "../../src/index.js";

const testImagePath = path.resolve(__dirname, "../fixtures/test.jpg");

describe("transform (full integration)", () => {
	it("should produce executable JS in binary mode", async () => {
		const code = "globalThis.__idx_binary = 7;";
		const output = await transform(code, {
			image: testImagePath,
			mode: "binary",
			ascii: { width: 40 },
			compress: false,
		});
		eval(output);
		expect((globalThis as any).__idx_binary).toBe(7);
		delete (globalThis as any).__idx_binary;
	});

	it("should produce executable JS in shaded mode", async () => {
		const code = "globalThis.__idx_shaded = 8;";
		const output = await transform(code, {
			image: testImagePath,
			mode: "shaded",
			ascii: { width: 40 },
			compress: false,
		});
		eval(output);
		expect((globalThis as any).__idx_shaded).toBe(8);
		delete (globalThis as any).__idx_shaded;
	});

	it("should work with compression enabled", async () => {
		const code = "globalThis.__idx_compress = 9;";
		const output = await transform(code, {
			image: testImagePath,
			ascii: { width: 40 },
			compress: true,
		});
		eval(output);
		expect((globalThis as any).__idx_compress).toBe(9);
		delete (globalThis as any).__idx_compress;
	});

	it("should throw on missing image", async () => {
		await expect(transform("code", {} as any)).rejects.toThrow(TypeError);
	});

	it("should return empty string for empty code", async () => {
		const result = await transform("", {
			image: testImagePath,
			ascii: { width: 20 },
		});
		expect(result).toBe("");
	});

	it("should produce executable JS with gzip in binary mode", async () => {
		const code = "globalThis.__idx_gzip_bin = 11;";
		const output = await transform(code, {
			image: testImagePath,
			mode: "binary",
			ascii: { width: 40 },
			compress: false,
			gzip: true,
		});
		eval(output);
		expect((globalThis as any).__idx_gzip_bin).toBe(11);
		delete (globalThis as any).__idx_gzip_bin;
	});

	it("should produce executable JS with gzip in shaded mode", async () => {
		const code = "globalThis.__idx_gzip_shd = 12;";
		const output = await transform(code, {
			image: testImagePath,
			mode: "shaded",
			ascii: { width: 40 },
			compress: false,
			gzip: true,
		});
		eval(output);
		expect((globalThis as any).__idx_gzip_shd).toBe(12);
		delete (globalThis as any).__idx_gzip_shd;
	});

	it("should default to binary mode", async () => {
		const code = "globalThis.__idx_default = 10;";
		const output = await transform(code, {
			image: testImagePath,
			ascii: { width: 40 },
			compress: false,
		});
		// Binary mode uses spaces (not fillers)
		expect(output).toContain(" ");
		eval(output);
		expect((globalThis as any).__idx_default).toBe(10);
		delete (globalThis as any).__idx_default;
	});
});

describe("imageToAscii (full integration)", () => {
	it("should produce multi-line ASCII art", async () => {
		const art = await imageToAscii(testImagePath, { width: 40 });
		const lines = art.split("\n");
		expect(lines.length).toBeGreaterThan(10);
		expect(lines[0].length).toBe(40);
	});

	it("should use custom charset", async () => {
		const art = await imageToAscii(testImagePath, {
			width: 20,
			charset: "AB",
		});
		for (const ch of art) {
			if (ch !== "\n") {
				expect("AB").toContain(ch);
			}
		}
	});

	it("should use default charset when not specified", async () => {
		const art = await imageToAscii(testImagePath, { width: 20 });
		expect(art.length).toBeGreaterThan(0);
	});
});
