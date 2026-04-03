/**
 * @file Luminance correction filters: brightness, contrast, gamma.
 */

/**
 * @brief Options for luminance adjustments.
 */
export interface AdjustOptions {
	/** @brief Brightness factor (0-2). @default 1 */
	brightness?: number;
	/** @brief Contrast factor (0-2). @default 1 */
	contrast?: number;
	/** @brief Gamma correction factor. @default 1 */
	gamma?: number;
}

/**
 * @brief Clamp a value to the 0-255 range.
 * @param v Input value.
 * @returns Clamped integer.
 */
function clamp(v: number): number {
	return Math.max(0, Math.min(255, Math.round(v)));
}

/**
 * @brief Apply brightness, contrast, and gamma corrections to luminance data.
 *
 * Processing order: brightness -> contrast -> gamma.
 * Each adjustment is skipped when its value equals the neutral default.
 *
 * @param luminance Input luminance array (0-255).
 * @param options   Adjustment parameters.
 * @returns New luminance array with corrections applied.
 */
export function adjust(
	luminance: Uint8Array,
	options: AdjustOptions,
): Uint8Array {
	const brightness = options.brightness ?? 1;
	const contrast = options.contrast ?? 1;
	const gamma = options.gamma ?? 1;

	if (brightness === 1 && contrast === 1 && gamma === 1) {
		return new Uint8Array(luminance);
	}

	const result = new Uint8Array(luminance.length);
	const invGamma = gamma !== 1 ? 1 / gamma : 1;

	for (let i = 0; i < luminance.length; i++) {
		let v = luminance[i];

		// Brightness
		if (brightness !== 1) {
			v = v * brightness;
		}

		// Contrast
		if (contrast !== 1) {
			v = ((v / 255 - 0.5) * contrast + 0.5) * 255;
		}

		// Gamma
		if (gamma !== 1) {
			v = 255 * (Math.max(0, v) / 255) ** invGamma;
		}

		result[i] = clamp(v);
	}

	return result;
}
