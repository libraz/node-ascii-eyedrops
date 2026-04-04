import { describe, expect, it } from "vitest";
import { encode } from "../../src/code/encode.js";
import { layout } from "../../src/layout/engine.js";
import type { LuminanceGrid } from "../../src/types.js";

/**
 * Integration tests that verify the full round-trip:
 * code -> encode -> layout -> eval -> original code executes.
 *
 * These tests use a synthetic luminance grid to avoid image I/O
 * dependencies in the test suite.
 */

/** @brief Create an all-dark grid with the given dimensions. */
function darkGrid(width: number, height: number): LuminanceGrid {
	return {
		data: new Uint8Array(width * height).fill(0),
		width,
		height,
	};
}

/** @brief Create a mixed grid (left half dark, right half light). */
function mixedGrid(width: number, height: number): LuminanceGrid {
	const data = new Uint8Array(width * height);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			data[y * width + x] = x < width / 2 ? 0 : 255;
		}
	}
	return { data, width, height };
}

describe("transform round-trip", () => {
	it("should execute original code via binary mode", async () => {
		const code = "globalThis.__test_binary = 42;";
		const payload = await encode(code, false);
		const grid = darkGrid(80, 20);
		const output = layout(payload, grid, "binary", false, 128);

		eval(output);
		expect((globalThis as any).__test_binary).toBe(42);
		delete (globalThis as any).__test_binary;
	});

	it("should execute original code via shaded mode", async () => {
		const code = "globalThis.__test_shaded = 99;";
		const payload = await encode(code, false);
		const grid = darkGrid(80, 20);
		const output = layout(payload, grid, "shaded", false, 128);

		eval(output);
		expect((globalThis as any).__test_shaded).toBe(99);
		delete (globalThis as any).__test_shaded;
	});

	it("should work with a mixed dark/light grid in binary mode", async () => {
		const code = "globalThis.__test_mixed = 'ok';";
		const payload = await encode(code, false);
		const grid = mixedGrid(80, 20);
		const output = layout(payload, grid, "binary", false, 128);

		// Verify spaces exist (light region)
		expect(output).toContain(" ");
		eval(output);
		expect((globalThis as any).__test_mixed).toBe("ok");
		delete (globalThis as any).__test_mixed;
	});

	it("should work with a mixed grid in shaded mode", async () => {
		const code = "globalThis.__test_shaded_mixed = true;";
		const payload = await encode(code, false);
		const grid = mixedGrid(80, 20);
		const output = layout(payload, grid, "shaded", false, 128);

		// Verify no spaces (shaded fills everything)
		for (const line of output.split("\n")) {
			if (line.startsWith(";$_+=")) {
				const content = line.slice(6, line.lastIndexOf('"'));
				expect(content).not.toContain(" ");
			}
		}
		eval(output);
		expect((globalThis as any).__test_shaded_mixed).toBe(true);
		delete (globalThis as any).__test_shaded_mixed;
	});

	it("should handle multi-line code", async () => {
		const code = [
			"globalThis.__test_multi = [];",
			"globalThis.__test_multi.push(1);",
			"globalThis.__test_multi.push(2);",
		].join("\n");
		const payload = await encode(code, false);
		const grid = darkGrid(100, 30);
		const output = layout(payload, grid, "binary", false, 128);

		eval(output);
		expect((globalThis as any).__test_multi).toEqual([1, 2]);
		delete (globalThis as any).__test_multi;
	});

	it("should execute original code via gzip binary mode", async () => {
		const code = "globalThis.__test_gzip_bin = 77;";
		const payload = await encode(code, true);
		const grid = darkGrid(100, 20);
		const output = layout(payload, grid, "binary", true, 128);

		eval(output);
		expect((globalThis as any).__test_gzip_bin).toBe(77);
		delete (globalThis as any).__test_gzip_bin;
	});

	it("should execute original code via gzip shaded mode", async () => {
		const code = "globalThis.__test_gzip_shd = 88;";
		const payload = await encode(code, true);
		const grid = darkGrid(100, 20);
		const output = layout(payload, grid, "shaded", true, 128);

		eval(output);
		expect((globalThis as any).__test_gzip_shd).toBe(88);
		delete (globalThis as any).__test_gzip_shd;
	});

	it("should handle code with special characters", async () => {
		const code = 'globalThis.__test_special = "hello\\nworld\\t\\"quoted\\"";';
		const payload = await encode(code, false);
		const grid = darkGrid(100, 20);
		const output = layout(payload, grid, "binary", false, 128);

		eval(output);
		expect((globalThis as any).__test_special).toBe('hello\nworld\t"quoted"');
		delete (globalThis as any).__test_special;
	});

	it("should handle unicode in code via gzip mode", async () => {
		// Non-gzip mode uses atob() which doesn't support UTF-8 multi-byte.
		// Gzip mode uses Buffer.toString() which handles UTF-8 correctly.
		const code = 'globalThis.__test_unicode = "こんにちは";';
		const payload = await encode(code, true);
		const grid = darkGrid(120, 20);
		const output = layout(payload, grid, "binary", true, 128);

		eval(output);
		expect((globalThis as any).__test_unicode).toBe("こんにちは");
		delete (globalThis as any).__test_unicode;
	});
});
