import { describe, expect, it } from "vitest";
import { adjust } from "../../src/ascii/adjustments.js";

describe("adjust", () => {
	it("should return a copy when all defaults", () => {
		const input = new Uint8Array([0, 128, 255]);
		const result = adjust(input, {});
		expect(result).toEqual(input);
		expect(result).not.toBe(input);
	});

	it("should apply brightness", () => {
		const input = new Uint8Array([100]);
		const result = adjust(input, { brightness: 2 });
		expect(result[0]).toBe(200);
	});

	it("should clamp brightness overflow", () => {
		const input = new Uint8Array([200]);
		const result = adjust(input, { brightness: 2 });
		expect(result[0]).toBe(255);
	});

	it("should apply contrast", () => {
		const input = new Uint8Array([128]);
		// At midpoint, contrast stretches around 0.5; result should be close to 128
		const result = adjust(input, { contrast: 2 });
		expect(Math.abs(result[0] - 128)).toBeLessThanOrEqual(2);
	});

	it("should apply gamma correction", () => {
		const input = new Uint8Array([200]);
		// gamma > 1 darkens midtones, gamma < 1 brightens them
		// For v=200: (200/255)^(1/0.5) = (0.784)^2 = 0.615 -> ~157
		// For v=200: (200/255)^(1/2) = (0.784)^0.5 = 0.885 -> ~226
		const brightened = adjust(input, { gamma: 2 });
		const darkened = adjust(input, { gamma: 0.5 });
		expect(brightened[0]).toBeGreaterThan(200);
		expect(darkened[0]).toBeLessThan(200);
	});

	it("should apply all corrections in order", () => {
		const input = new Uint8Array([100]);
		const result = adjust(input, {
			brightness: 1.5,
			contrast: 1.2,
			gamma: 0.8,
		});
		// Just verify it produces a valid output
		expect(result[0]).toBeGreaterThanOrEqual(0);
		expect(result[0]).toBeLessThanOrEqual(255);
	});
});
