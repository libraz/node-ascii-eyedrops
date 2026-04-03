import { describe, expect, it } from "vitest";
import { toGrayscale } from "../../src/ascii/grayscale.js";
import type { RawImage } from "../../src/types.js";

describe("toGrayscale", () => {
	it("should convert pure white to 255", () => {
		const image: RawImage = {
			data: new Uint8Array([255, 255, 255, 255]),
			width: 1,
			height: 1,
		};
		expect(toGrayscale(image)[0]).toBe(255);
	});

	it("should convert pure black to 0", () => {
		const image: RawImage = {
			data: new Uint8Array([0, 0, 0, 255]),
			width: 1,
			height: 1,
		};
		expect(toGrayscale(image)[0]).toBe(0);
	});

	it("should apply BT.601 weights correctly", () => {
		const image: RawImage = {
			data: new Uint8Array([100, 150, 50, 255]),
			width: 1,
			height: 1,
		};
		const expected = Math.round(0.299 * 100 + 0.587 * 150 + 0.114 * 50);
		expect(toGrayscale(image)[0]).toBe(expected);
	});

	it("should handle multiple pixels", () => {
		const image: RawImage = {
			data: new Uint8Array([
				0, 0, 0, 255, 255, 255, 255, 255, 128, 128, 128, 255,
			]),
			width: 3,
			height: 1,
		};
		const result = toGrayscale(image);
		expect(result.length).toBe(3);
		expect(result[0]).toBe(0);
		expect(result[1]).toBe(255);
		expect(result[2]).toBe(128);
	});

	it("should ignore alpha channel", () => {
		const image: RawImage = {
			data: new Uint8Array([100, 100, 100, 0]),
			width: 1,
			height: 1,
		};
		expect(toGrayscale(image)[0]).toBe(100);
	});
});
