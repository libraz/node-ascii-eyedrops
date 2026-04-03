import { describe, expect, it } from "vitest";
import { encode } from "../../src/code/encode.js";
import { base64ToText, fromBase64 } from "../../src/util/base64.js";
import { gzipDecode } from "../../src/util/gzip.js";

describe("encode", () => {
	it("should produce base64-only characters without gzip", async () => {
		const result = await encode('console.log("hello")', false);
		expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
	});

	it("should round-trip without gzip", async () => {
		const code = 'console.log("hello")';
		const encoded = await encode(code, false);
		expect(base64ToText(encoded)).toBe(code);
	});

	it("should round-trip with gzip", async () => {
		const code = 'console.log("hello")';
		const encoded = await encode(code, true);
		const compressed = fromBase64(encoded);
		const decompressed = await gzipDecode(compressed);
		expect(new TextDecoder().decode(decompressed)).toBe(code);
	});

	it("should produce base64-only characters with gzip", async () => {
		const result = await encode('console.log("hello")', true);
		expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
	});
});
