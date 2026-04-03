import { describe, expect, it } from "vitest";
import { layoutBinary } from "../../src/layout/binary.js";
import type { LuminanceGrid } from "../../src/types.js";

describe("layoutBinary", () => {
	it("should place payload chars at dark cells and spaces at light cells", () => {
		const grid: LuminanceGrid = {
			// 4x2 grid: alternating dark(0)/light(255)
			data: new Uint8Array([0, 255, 0, 255, 0, 255, 0, 255]),
			width: 4,
			height: 2,
		};
		const lines = layoutBinary("ABCD", grid, 128);
		expect(lines[0]).toBe("A B ");
		expect(lines[1]).toBe("C D ");
	});

	it("should pad exhausted dark cells with dense non-base64 char", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([0, 0, 0, 0]),
			width: 2,
			height: 2,
		};
		const lines = layoutBinary("XY", grid, 128);
		expect(lines[0]).toBe("XY");
		expect(lines[1]).toBe("##");
	});

	it("should produce all spaces for a fully light grid", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([255, 255, 255, 255]),
			width: 2,
			height: 2,
		};
		const lines = layoutBinary("AB", grid, 128);
		expect(lines[0]).toBe("  ");
		expect(lines[1]).toBe("  ");
	});

	it("should respect threshold parameter", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([100, 200]),
			width: 2,
			height: 1,
		};
		// threshold=50 -> both cells are "light"
		const lines = layoutBinary("A", grid, 50);
		expect(lines[0]).toBe("  ");
	});
});
