import { describe, expect, it } from "vitest";
import {
	base64ToText,
	fromBase64,
	textToBase64,
	toBase64,
} from "../../src/util/base64.js";

describe("base64", () => {
	it("should round-trip binary data", () => {
		const data = new Uint8Array([0, 1, 127, 128, 255]);
		const encoded = toBase64(data);
		const decoded = fromBase64(encoded);
		expect(decoded).toEqual(data);
	});

	it("should round-trip text data", () => {
		const text = 'console.log("Hello, world!")';
		const encoded = textToBase64(text);
		const decoded = base64ToText(encoded);
		expect(decoded).toBe(text);
	});

	it("should produce only base64-safe characters", () => {
		const data = new Uint8Array(256);
		for (let i = 0; i < 256; i++) data[i] = i;
		const encoded = toBase64(data);
		expect(encoded).toMatch(/^[A-Za-z0-9+/=]+$/);
	});

	it("should handle empty input", () => {
		expect(toBase64(new Uint8Array(0))).toBe("");
		expect(fromBase64("")).toEqual(new Uint8Array(0));
		expect(textToBase64("")).toBe("");
		expect(base64ToText("")).toBe("");
	});
});
