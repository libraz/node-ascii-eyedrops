import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { SharpAdapter } from "../../src/ascii/adapter/sharp-adapter.js";

const testImagePath = path.resolve(__dirname, "../fixtures/test.jpg");

describe("SharpAdapter", () => {
	const adapter = new SharpAdapter();

	it("should decode a JPEG file by path", async () => {
		const raw = await adapter.decode(testImagePath, 40);
		expect(raw.width).toBe(40);
		expect(raw.height).toBeGreaterThan(0);
		// RGBA: 4 bytes per pixel
		expect(raw.data.length).toBe(raw.width * raw.height * 4);
	});

	it("should decode a Buffer input", async () => {
		const buffer = fs.readFileSync(testImagePath);
		const raw = await adapter.decode(new Uint8Array(buffer), 30);
		expect(raw.width).toBe(30);
		expect(raw.data.length).toBe(raw.width * raw.height * 4);
	});

	it("should respect explicit targetHeight", async () => {
		const raw = await adapter.decode(testImagePath, 40, 20);
		expect(raw.width).toBe(40);
		expect(raw.height).toBe(20);
	});

	it("should auto-calculate height with aspect correction", async () => {
		const raw = await adapter.decode(testImagePath, 80);
		// mask.jpeg is 768x1024, aspect=1.33, with 0.5 correction -> ~53
		expect(raw.height).toBeGreaterThan(30);
		expect(raw.height).toBeLessThan(80);
	});

	it("should throw on invalid input", async () => {
		await expect(adapter.decode("nonexistent.png", 40)).rejects.toThrow();
	});
});
