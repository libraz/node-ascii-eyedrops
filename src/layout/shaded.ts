/**
 * @file Shaded layout engine.
 *
 * Fills every cell with a character, using base64 payload characters
 * for dark regions and non-base64 filler characters of varying visual
 * weight for lighter regions, producing a grayscale ASCII art effect.
 */

import type { LuminanceGrid } from "../types.js";

/**
 * @brief Filler characters ordered from lightest to darkest visual weight.
 *
 * All characters are non-base64 safe, so they can be cleanly stripped
 * during decode via `/[^A-Za-z0-9+\/=]/g`.
 */
const FILLERS = [".", ":", "-", "~", "!", "*", "#", "@", "%"];

/**
 * @brief Lay out payload characters with full-width shaded filler.
 *
 * Dark pixels (luminance <= threshold) receive payload characters when
 * available. All other cells receive a filler character whose visual
 * weight corresponds to the pixel's luminance, creating a smooth
 * gradient effect.
 *
 * @param payload   Base64-encoded payload string.
 * @param grid      Luminance grid from image processing.
 * @param threshold Luminance threshold for payload placement. @default 128
 * @returns Array of line content strings (one per grid row).
 */
export function layoutShaded(
	payload: string,
	grid: LuminanceGrid,
	threshold = 128,
): string[] {
	const { data, width, height } = grid;
	const lines: string[] = [];
	const maxFillerIdx = FILLERS.length - 1;
	let idx = 0;

	for (let y = 0; y < height; y++) {
		let line = "";
		for (let x = 0; x < width; x++) {
			const lum = data[y * width + x];

			if (lum <= threshold && idx < payload.length) {
				line += payload[idx++];
			} else {
				// Map luminance to filler: 0 (darkest) -> last filler, 255 (lightest) -> first filler
				const fillerIdx = Math.floor(((255 - lum) / 255) * maxFillerIdx);
				line += FILLERS[fillerIdx];
			}
		}
		lines.push(line);
	}

	return lines;
}
