/**
 * @file Binary layout engine.
 *
 * Places payload characters at dark pixels and spaces at light pixels,
 * producing an ASCII silhouette of the source image.
 */

import type { LuminanceGrid } from "../types.js";

/**
 * @brief Padding character for dark cells after the payload is exhausted.
 *
 * Must be a non-base64 character (stripped during decode) that is
 * visually dense to preserve the image silhouette.
 */
const DARK_PAD = "#";

/**
 * @brief Lay out payload characters using binary (dark/light) mapping.
 *
 * Dark pixels (luminance <= threshold) receive payload characters.
 * Light pixels receive spaces. When the payload is exhausted, remaining
 * dark cells receive a visually dense non-base64 padding character
 * to preserve the image silhouette.
 *
 * @param payload   Base64-encoded payload string.
 * @param grid      Luminance grid from image processing.
 * @param threshold Binarization threshold (0-255). @default 128
 * @returns Array of line content strings (one per grid row).
 */
export function layoutBinary(
	payload: string,
	grid: LuminanceGrid,
	threshold = 128,
): string[] {
	const { data, width, height } = grid;
	const lines: string[] = [];
	let idx = 0;

	for (let y = 0; y < height; y++) {
		let line = "";
		for (let x = 0; x < width; x++) {
			const lum = data[y * width + x];
			if (lum <= threshold) {
				line += idx < payload.length ? payload[idx++] : DARK_PAD;
			} else {
				line += " ";
			}
		}
		lines.push(line);
	}

	return lines;
}
