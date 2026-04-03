import { describe, expect, it } from "vitest";
import { gzipDecode, gzipEncode } from "../../src/util/gzip.js";

describe("gzip", () => {
	it("should round-trip binary data", async () => {
		const data = new Uint8Array([72, 101, 108, 108, 111]);
		const compressed = await gzipEncode(data);
		const decompressed = await gzipDecode(compressed);
		expect(decompressed).toEqual(data);
	});

	it("should round-trip text via TextEncoder/TextDecoder", async () => {
		const text = 'console.log("Hello, world!")';
		const data = new TextEncoder().encode(text);
		const compressed = await gzipEncode(data);
		const decompressed = await gzipDecode(compressed);
		expect(new TextDecoder().decode(decompressed)).toBe(text);
	});

	it("should produce output smaller than input for repetitive data", async () => {
		const data = new TextEncoder().encode("a".repeat(1000));
		const compressed = await gzipEncode(data);
		expect(compressed.length).toBeLessThan(data.length);
	});
});
