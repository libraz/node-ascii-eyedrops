import { gunzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { toBase64 } from "../../src/util/base64.js";
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

	it("should produce valid gzip format decompressible by zlib.gunzipSync", async () => {
		const text = "globalThis.__gzip_compat = 1;";
		const data = new TextEncoder().encode(text);
		const compressed = await gzipEncode(data);

		// The generated postamble uses require("zlib").gunzipSync(Buffer.from(...,"base64"))
		// Verify that our gzipEncode output is compatible with that decode path
		const b64 = toBase64(compressed);
		const decoded = gunzipSync(Buffer.from(b64, "base64")).toString();
		expect(decoded).toBe(text);
	});

	it("should handle empty input", async () => {
		const data = new Uint8Array(0);
		const compressed = await gzipEncode(data);
		const decompressed = await gzipDecode(compressed);
		expect(decompressed).toEqual(data);
	});
});
