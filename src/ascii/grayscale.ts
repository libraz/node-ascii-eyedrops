/**
 * @file RGBA to grayscale luminance conversion.
 */

import type { RawImage } from "../types.js";

/**
 * @brief Convert an RGBA image to a grayscale luminance array.
 *
 * Uses the ITU-R BT.601 luma coefficients:
 *   L = 0.299 * R + 0.587 * G + 0.114 * B
 *
 * @param image Raw RGBA image data.
 * @returns Luminance values (0-255), one per pixel.
 */
export function toGrayscale(image: RawImage): Uint8Array {
	const { data, width, height } = image;
	const pixelCount = width * height;
	const luminance = new Uint8Array(pixelCount);

	for (let i = 0; i < pixelCount; i++) {
		const offset = i * 4;
		luminance[i] = Math.round(
			0.299 * data[offset] +
				0.587 * data[offset + 1] +
				0.114 * data[offset + 2],
		);
	}

	return luminance;
}
