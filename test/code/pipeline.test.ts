import { describe, expect, it } from "vitest";
import { transformCode } from "../../src/code/pipeline.js";
import { base64ToText } from "../../src/util/base64.js";

describe("transformCode", () => {
	it("should produce base64 output", async () => {
		const result = await transformCode("console.log(1)", {});
		expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
	});

	it("should round-trip with compression disabled", async () => {
		const code = 'console.log("hello")';
		const result = await transformCode(code, { compress: false });
		expect(base64ToText(result)).toBe(code);
	});

	it("should produce shorter output with compression enabled", async () => {
		const code = "const longVariableName = 1;\nconsole.log(longVariableName);";
		const compressed = await transformCode(code, { compress: true });
		const uncompressed = await transformCode(code, { compress: false });
		expect(compressed.length).toBeLessThanOrEqual(uncompressed.length);
	});

	it("should produce base64 output with gzip enabled", async () => {
		const result = await transformCode("console.log(1)", { gzip: true });
		expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
	});
});
