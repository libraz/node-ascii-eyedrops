/**
 * @file Image-to-luminance-grid pipeline.
 *
 * Orchestrates: decode -> grayscale -> adjustments -> [invert] -> [dither]
 * to produce a LuminanceGrid suitable for layout engines.
 */

import type { AsciiOptions, ImageAdapter, LuminanceGrid } from "../types.js";
import { adjust } from "./adjustments.js";
import { floydSteinberg } from "./dither.js";
import { toGrayscale } from "./grayscale.js";

/**
 * @brief Auto-detect the appropriate image adapter for the current environment.
 * @returns Platform-specific ImageAdapter instance.
 * @throws When no suitable adapter is available.
 */
async function getAdapter(): Promise<ImageAdapter> {
	if (typeof process !== "undefined" && process.versions?.node) {
		const { SharpAdapter } = await import("./adapter/sharp-adapter.js");
		return new SharpAdapter();
	}
	const { CanvasAdapter } = await import("./adapter/canvas-adapter.js");
	return new CanvasAdapter();
}

/**
 * @brief Convert an image to a luminance grid.
 *
 * @param input   Image file path, URL, or binary data.
 * @param options ASCII generation options (width, height, corrections, etc.).
 * @returns Luminance grid with values 0-255 per cell.
 */
export async function imageToLuminanceGrid(
	input: string | Uint8Array,
	options?: AsciiOptions,
): Promise<LuminanceGrid> {
	const width = options?.width ?? 120;
	const adapter = await getAdapter();

	const raw = await adapter.decode(input, width, options?.height);
	let luminance = toGrayscale(raw);

	luminance = adjust(luminance, {
		brightness: options?.brightness,
		contrast: options?.contrast,
		gamma: options?.gamma,
	});

	if (options?.invert) {
		for (let i = 0; i < luminance.length; i++) {
			luminance[i] = 255 - luminance[i];
		}
	}

	if (options?.dither) {
		luminance = floydSteinberg(luminance, raw.width, raw.height);
	}

	return { data: luminance, width: raw.width, height: raw.height };
}
