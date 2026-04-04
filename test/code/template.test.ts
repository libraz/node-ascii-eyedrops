import { describe, expect, it } from "vitest";
import {
	buildLine,
	buildPostamble,
	buildPreamble,
	LINE_COMMENT,
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

	describe("LINE_COMMENT", () => {
		it("should be //", () => {
			expect(LINE_COMMENT).toBe("//");
		});
	});

	describe("buildPostamble", () => {
		it("should contain eval and atob for non-gzip", () => {
			const result = buildPostamble(false);
			expect(result).toContain("eval(atob(");
			expect(result).toContain("replace(");
		});

		it("should produce valid JavaScript for non-gzip", () => {
			const preamble = buildPreamble();
			const postamble = buildPostamble(false);
			expect(() => new Function(preamble + postamble)).not.toThrow();
		});

		it("should contain gzip decompression logic for gzip mode", () => {
			const result = buildPostamble(true);
			expect(result).toContain("gunzipSync");
			expect(result).toContain("Buffer.from");
		});

		it("should produce valid JavaScript for gzip", () => {
			const preamble = buildPreamble();
			const postamble = buildPostamble(true);
			expect(() => new Function(preamble + postamble)).not.toThrow();
		});
	});
});
