import { describe, expect, it } from "vitest";
import { layout } from "../../src/layout/engine.js";
import type { LuminanceGrid } from "../../src/types.js";

describe("layout", () => {
	const smallGrid: LuminanceGrid = {
		data: new Uint8Array([0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255]),
		width: 4,
		height: 3,
	};

	it("should produce valid JavaScript in binary mode", () => {
		const result = layout("ABCDEF", smallGrid, "binary", false, 128);
		expect(result).toContain('$_=""');
		expect(result).toContain(";$_+=");
		expect(result).toContain("eval(atob(");
		expect(() => new Function(result)).not.toThrow();
	});

	it("should produce valid JavaScript in shaded mode", () => {
		const result = layout("ABCDEF", smallGrid, "shaded", false, 128);
		expect(result).toContain('$_=""');
		expect(result).toContain(";$_+=");
		expect(result).toContain("eval(atob(");
		expect(() => new Function(result)).not.toThrow();
	});

	it("should throw when payload exceeds dark cell capacity", () => {
		const tinyGrid: LuminanceGrid = {
			data: new Uint8Array([0, 255]),
			width: 2,
			height: 1,
		};
		expect(() => layout("ABCD", tinyGrid, "binary", false, 128)).toThrow(
			/Payload too large/,
		);
	});

	it("should have all lines ending with //", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array(40).fill(0),
			width: 10,
			height: 4,
		};
		const code = layout("ABCDEF", grid, "binary", false, 128);
		const lines = code.split("\n");
		for (const line of lines) {
			expect(line.endsWith("//")).toBe(true);
		}
	});

	it("should have uniform line width in binary mode", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array(200).fill(0),
			width: 20,
			height: 10,
		};
		const code = layout("ABCDEF", grid, "binary", false, 128);
		const lines = code.split("\n");
		const widths = lines.map((l) => l.length);
		// All lines should be the same width
		expect(new Set(widths).size).toBe(1);
	});

	it("should have uniform line width in shaded mode", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array(200).fill(100),
			width: 20,
			height: 10,
		};
		const code = layout("ABCDEF", grid, "shaded", false, 128);
		const lines = code.split("\n");
		const widths = lines.map((l) => l.length);
		expect(new Set(widths).size).toBe(1);
	});

	it("should work with threshold 0 (only luminance=0 is dark)", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([0, 0, 1, 1, 0, 0, 1, 1]),
			width: 4,
			height: 2,
		};
		// Only 4 dark cells (value=0), which equals payload length
		const code = layout("ABCD", grid, "binary", false, 0);
		expect(code).toContain("eval(atob(");
		expect(() => new Function(code)).not.toThrow();
	});

	it("should work with threshold 255 (all cells are dark)", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([128, 200, 255, 100]),
			width: 2,
			height: 2,
		};
		const code = layout("AB", grid, "binary", false, 255);
		expect(code).toContain("eval(atob(");
		expect(() => new Function(code)).not.toThrow();
	});

	it("should produce valid JS with gzip flag set", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array(200).fill(0),
			width: 20,
			height: 10,
		};
		const code = layout("ABCDEF", grid, "binary", true, 128);
		expect(code).toContain("gunzipSync");
		expect(() => new Function(code)).not.toThrow();
	});

	it("should use exactly payload.length dark cells for payload", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([0, 0, 0, 255]),
			width: 2,
			height: 2,
		};
		// 3 dark cells, payload of 3
		const code = layout("ABC", grid, "binary", false, 128);
		expect(code).toContain("eval(atob(");
	});

	it("should pad with spaces when shaded padLen is within comment overhead", () => {
		// postamble (non-gzip) = `;eval(atob($_.replace(R,"")))` = 29 chars
		// padLen for postamble = targetWidth - 29 - 2 (suffix "//")
		// gridWidth=24 → payloadLineWidth=33 → targetWidth=max(33,26,31)=33
		// postamble padLen = 33 - 29 - 2 = 2 ≤ commentOverhead(4) → spaces path
		const grid: LuminanceGrid = {
			data: new Uint8Array(24 * 5).fill(0),
			width: 24,
			height: 5,
		};
		const code = layout("AB", grid, "shaded", false, 128);
		const lines = code.split("\n");
		for (const line of lines) {
			expect(line.endsWith("//")).toBe(true);
		}
		// Postamble (last line) should use spaces, not block comment
		const postamble = lines[lines.length - 1];
		expect(postamble).not.toContain("/*");
		expect(postamble).toContain("eval(atob(");
		expect(() => new Function(code)).not.toThrow();
	});
});
