/**
 * @file Shared filler character utilities for layout engines.
 *
 * Filler characters are non-base64-safe characters of varying visual
 * weight, used to create shading effects while being cleanly stripped
 * during decode via `/[^\w+\/=]/g`.
 */

/** @brief Filler characters ordered from lightest to darkest visual weight. */
export const FILLERS = [".", ":", "-", "~", "!", "*", "#", "@", "%"];

/**
 * @brief Select a filler character matching a luminance value.
 * @param luminance Pixel luminance (0=darkest, 255=lightest).
 * @returns Filler character of appropriate visual weight.
 */
export function selectFiller(luminance: number): string {
	const maxIdx = FILLERS.length - 1;
	return FILLERS[Math.floor(((255 - luminance) / 255) * maxIdx)];
}
