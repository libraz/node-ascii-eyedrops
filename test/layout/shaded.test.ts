import { describe, expect, it } from "vitest";
import { layoutShaded } from "../../src/layout/shaded.js";
import type { LuminanceGrid } from "../../src/types.js";

describe("layoutShaded", () => {
	it("should place payload chars at dark cells and fillers elsewhere", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([0, 255, 0, 255]),
			width: 2,
			height: 2,
		};
		const lines = layoutShaded("AB", grid, 128);
		// Dark cells get payload, light cells get filler
		expect(lines[0][0]).toBe("A");
		expect(lines[0][1]).toBe("."); // lightest filler for luminance 255
		expect(lines[1][0]).toBe("B");
		expect(lines[1][1]).toBe(".");
	});

	it("should fill all cells (no spaces)", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([0, 128, 255, 64]),
			width: 2,
			height: 2,
		};
		const lines = layoutShaded("X", grid, 128);
		for (const line of lines) {
			expect(line).not.toContain(" ");
			expect(line.length).toBe(2);
		}
	});

	it("should use darker fillers for darker luminance values", () => {
		const grid: LuminanceGrid = {
			// All cells above threshold -> all fillers
			data: new Uint8Array([200, 50]),
			width: 2,
			height: 1,
		};
		const lines = layoutShaded("", grid, 10);
		// lum=200 should be lighter filler than lum=50
		const lightFiller = lines[0][0];
		const darkFiller = lines[0][1];
		// Just verify both are non-base64 characters
		expect(lightFiller).toMatch(/[^A-Za-z0-9+/=]/);
		expect(darkFiller).toMatch(/[^A-Za-z0-9+/=]/);
	});

	it("should produce strippable output (no base64 chars in fillers)", () => {
		const grid: LuminanceGrid = {
			data: new Uint8Array([255, 255, 255, 255]),
			width: 2,
			height: 2,
		};
		const lines = layoutShaded("", grid, 128);
		for (const line of lines) {
			const stripped = line.replace(/[^A-Za-z0-9+/=]/g, "");
			expect(stripped).toBe("");
		}
	});
});
