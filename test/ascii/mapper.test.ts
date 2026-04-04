import { describe, expect, it } from "vitest";
import { DEFAULT_CHARSET, mapToChars } from "../../src/ascii/mapper.js";

describe("mapToChars", () => {
	it("should map 0 to the first character (lightest)", () => {
		const result = mapToChars(new Uint8Array([0]), 1);
		expect(result).toBe(DEFAULT_CHARSET[0]);
	});

	it("should map 255 to the last character (darkest)", () => {
		const result = mapToChars(new Uint8Array([255]), 1);
		expect(result).toBe(DEFAULT_CHARSET[DEFAULT_CHARSET.length - 1]);
	});

	it("should produce correct number of lines", () => {
		const data = new Uint8Array(6); // 3 wide x 2 tall
		const result = mapToChars(data, 3);
		const lines = result.split("\n");
		expect(lines.length).toBe(2);
		expect(lines[0].length).toBe(3);
	});

	it("should use a custom charset", () => {
		const result = mapToChars(new Uint8Array([255]), 1, "AB");
		expect(result).toBe("B");
	});

	it("should fall back to default charset when given empty string", () => {
		const result = mapToChars(new Uint8Array([0]), 1, "");
		expect(result).toBe(DEFAULT_CHARSET[0]);
	});

	it("should work with a single-character charset", () => {
		const data = new Uint8Array([0, 128, 255]);
		const result = mapToChars(data, 3, "X");
		expect(result).toBe("XXX");
	});

	it("should handle a full luminance range across multiple rows", () => {
		const data = new Uint8Array([0, 128, 255, 64, 192, 32]);
		const result = mapToChars(data, 3);
		const lines = result.split("\n");
		expect(lines.length).toBe(2);
		for (const line of lines) {
			expect(line.length).toBe(3);
			for (const ch of line) {
				expect(DEFAULT_CHARSET).toContain(ch);
			}
		}
	});
});
