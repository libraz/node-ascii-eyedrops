import { describe, expect, it } from "vitest";
import {
	buildLine,
	buildLineComment,
	buildPostamble,
	buildPreamble,
} from "../../src/code/template.js";

describe("template", () => {
	describe("buildPreamble", () => {
		it("should return var declaration with strip regex", () => {
			expect(buildPreamble()).toBe('var $_="",R=/[^\\w+\\/=]/g');
		});

		it("should be valid JavaScript", () => {
			expect(() => new Function(buildPreamble())).not.toThrow();
		});
	});

	describe("buildLine", () => {
		it("should wrap content in string concatenation", () => {
			expect(buildLine("abc")).toBe(';$_+="abc"');
		});

		it("should handle empty content", () => {
			expect(buildLine("")).toBe(';$_+=""');
		});
	});

	describe("buildLineComment", () => {
		it("should return //", () => {
			expect(buildLineComment()).toBe("//");
		});
	});

	describe("buildPostamble", () => {
		it("should contain eval and atob for non-gzip", () => {
			const result = buildPostamble("binary", false);
			expect(result).toContain("eval(atob(");
			expect(result).toContain("replace(");
		});

		it("should produce valid JavaScript for binary non-gzip", () => {
			const preamble = buildPreamble();
			const postamble = buildPostamble("binary", false);
			// Simulate: var $_="" + postamble should parse
			expect(() => new Function(preamble + postamble)).not.toThrow();
		});

		it("should produce valid JavaScript for shaded non-gzip", () => {
			const preamble = buildPreamble();
			const postamble = buildPostamble("shaded", false);
			expect(() => new Function(preamble + postamble)).not.toThrow();
		});

		it("should contain gzip decompression logic for gzip mode", () => {
			const result = buildPostamble("binary", true);
			expect(result).toContain("gunzipSync");
			expect(result).toContain("Buffer.from");
		});

		it("should produce valid JavaScript for binary gzip", () => {
			const preamble = buildPreamble();
			const postamble = buildPostamble("binary", true);
			expect(() => new Function(preamble + postamble)).not.toThrow();
		});

		it("should produce valid JavaScript for shaded gzip", () => {
			const preamble = buildPreamble();
			const postamble = buildPostamble("shaded", true);
			expect(() => new Function(preamble + postamble)).not.toThrow();
		});
	});
});
