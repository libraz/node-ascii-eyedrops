import { describe, expect, it } from "vitest";
import { compress } from "../../src/code/compress.js";

describe("compress", () => {
	it("should return original code when disabled", async () => {
		const code = "const x = 1;\nconsole.log(  x  );";
		const result = await compress(code, false);
		expect(result).toBe(code);
	});

	it("should minify valid JavaScript", async () => {
		const code = "const longVariableName = 1;\nconsole.log(longVariableName);";
		const result = await compress(code, true);
		expect(result.length).toBeLessThan(code.length);
	});

	it("should produce valid JavaScript after minification", async () => {
		const code = "const x = 42; function foo() { return x; }";
		const result = await compress(code, true);
		// Verify it can be parsed (no syntax errors)
		expect(() => new Function(result)).not.toThrow();
	});

	it("should fall back to original code on invalid input", async () => {
		const code = "this is not valid javascript {{{";
		const result = await compress(code, true);
		expect(result).toBe(code);
	});
});
