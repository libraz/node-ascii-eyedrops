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
});
