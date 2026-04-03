import { describe, expect, it } from "vitest";
import { floydSteinberg } from "../../src/ascii/dither.js";

describe("floydSteinberg", () => {
	it("should produce binary output with 2 levels", () => {
		const input = new Uint8Array([50, 100, 150, 200]);
		const result = floydSteinberg(input, 2, 2, 2);
		for (let i = 0; i < result.length; i++) {
			expect(result[i] === 0 || result[i] === 255).toBe(true);
		}
	});

	it("should preserve mean luminance approximately", () => {
		const input = new Uint8Array(100);
		for (let i = 0; i < 100; i++) input[i] = 128;
		const result = floydSteinberg(input, 10, 10, 2);
		const sum = result.reduce((a, b) => a + b, 0);
		const mean = sum / result.length;
		// Mean should be roughly 128 (allow 20% tolerance)
		expect(Math.abs(mean - 128)).toBeLessThan(40);
	});

	it("should not modify the input array", () => {
		const input = new Uint8Array([100, 150, 200, 50]);
		const copy = new Uint8Array(input);
		floydSteinberg(input, 2, 2);
		expect(input).toEqual(copy);
	});
});
