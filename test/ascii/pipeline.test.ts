import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { imageToLuminanceGrid } from "../../src/ascii/pipeline.js";

const testImagePath = path.resolve(__dirname, "../fixtures/test.jpg");

describe("imageToLuminanceGrid", () => {
	it("should return a grid with correct dimensions", async () => {
		const grid = await imageToLuminanceGrid(testImagePath, { width: 40 });
		expect(grid.width).toBe(40);
		expect(grid.height).toBeGreaterThan(0);
		expect(grid.data.length).toBe(grid.width * grid.height);
	});

	it("should produce luminance values in 0-255 range", async () => {
		const grid = await imageToLuminanceGrid(testImagePath, { width: 20 });
		for (let i = 0; i < grid.data.length; i++) {
			expect(grid.data[i]).toBeGreaterThanOrEqual(0);
			expect(grid.data[i]).toBeLessThanOrEqual(255);
		}
	});

	it("should accept Buffer input", async () => {
		const buffer = fs.readFileSync(testImagePath);
		const grid = await imageToLuminanceGrid(new Uint8Array(buffer), {
			width: 20,
		});
		expect(grid.width).toBe(20);
		expect(grid.data.length).toBe(grid.width * grid.height);
	});

	it("should apply invert option", async () => {
		const normal = await imageToLuminanceGrid(testImagePath, { width: 10 });
		const inverted = await imageToLuminanceGrid(testImagePath, {
			width: 10,
			invert: true,
		});
		// Inverted values should sum to 255 with normal
		for (let i = 0; i < normal.data.length; i++) {
			expect(normal.data[i] + inverted.data[i]).toBe(255);
		}
	});

	it("should apply dither option without error", async () => {
		const grid = await imageToLuminanceGrid(testImagePath, {
			width: 20,
			dither: true,
		});
		expect(grid.data.length).toBe(grid.width * grid.height);
	});

	it("should apply contrast/brightness/gamma options", async () => {
		const grid = await imageToLuminanceGrid(testImagePath, {
			width: 10,
			contrast: 1.5,
			brightness: 1.2,
			gamma: 0.8,
		});
		expect(grid.data.length).toBe(grid.width * grid.height);
	});

	it("should respect custom height", async () => {
		const grid = await imageToLuminanceGrid(testImagePath, {
			width: 30,
			height: 15,
		});
		expect(grid.width).toBe(30);
		expect(grid.height).toBe(15);
	});
});
