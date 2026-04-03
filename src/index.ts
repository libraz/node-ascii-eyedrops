/**
 * @file Public API for @libraz/ascii-eyedrops.
 *
 * Provides two entry points:
 * - transform(): Convert JS code into executable ASCII art.
 * - imageToAscii(): Generate traditional ASCII art from an image.
 */

import { DEFAULT_CHARSET, mapToChars } from "./ascii/mapper.js";
import { imageToLuminanceGrid } from "./ascii/pipeline.js";
import { transformCode } from "./code/pipeline.js";
import { layout } from "./layout/engine.js";
import type { AsciiOptions, TransformOptions } from "./types.js";

export type { AsciiOptions, LayoutMode, TransformOptions } from "./types.js";

/**
 * @brief Transform JavaScript code into executable ASCII art.
 *
 * The output is valid JavaScript that:
 * 1. Visually renders as ASCII art of the source image
 * 2. Executes the original code when evaluated
 *
 * @param code    JavaScript source code to transform.
 * @param options Transform options including the source image.
 * @returns Executable JavaScript whose visual form is ASCII art.
 * @throws {TypeError} When options.image is missing.
 * @throws {Error} When image decoding fails or payload exceeds capacity.
 */
export async function transform(
	code: string,
	options: TransformOptions,
): Promise<string> {
	if (!options?.image) {
		throw new TypeError("options.image is required");
	}
	if (!code) {
		return "";
	}

	const mode = options.mode ?? "binary";
	const threshold = options.ascii?.threshold ?? 128;

	const payload = await transformCode(code, {
		compress: options.compress,
		gzip: options.gzip,
	});

	const grid = await imageToLuminanceGrid(options.image, options.ascii);

	return layout(payload, grid, mode, options.gzip ?? false, threshold);
}

/**
 * @brief Generate traditional ASCII art from an image.
 *
 * Standalone utility that converts an image to a multi-line string
 * using character density to represent luminance.
 *
 * @param input   Image file path, URL, or binary data.
 * @param options ASCII generation options.
 * @returns Multi-line ASCII art string.
 */
export async function imageToAscii(
	input: string | Uint8Array,
	options?: AsciiOptions,
): Promise<string> {
	const grid = await imageToLuminanceGrid(input, options);
	const charset = options?.charset ?? DEFAULT_CHARSET;
	return mapToChars(grid.data, grid.width, charset);
}
