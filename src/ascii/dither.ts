/**
 * @file Floyd-Steinberg error diffusion dithering.
 */

/**
 * @brief Apply Floyd-Steinberg dithering to a luminance array.
 *
 * Distributes quantization error to neighboring pixels using the
 * standard kernel:
 *   - right:        7/16
 *   - bottom-left:  3/16
 *   - bottom:       5/16
 *   - bottom-right: 1/16
 *
 * @param luminance Input luminance values (0-255).
 * @param width     Image width.
 * @param height    Image height.
 * @param levels    Number of quantization levels. @default 2
 * @returns New luminance array with dithering applied.
 */
export function floydSteinberg(
	luminance: Uint8Array,
	width: number,
	height: number,
	levels = 2,
): Uint8Array {
	const buffer = new Float32Array(luminance);
	const step = 255 / (levels - 1);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = y * width + x;
			const oldVal = buffer[idx];
			const newVal = Math.round(oldVal / step) * step;
			buffer[idx] = newVal;
			const err = oldVal - newVal;

			if (x + 1 < width) {
				buffer[idx + 1] += err * (7 / 16);
			}
			if (y + 1 < height) {
				if (x - 1 >= 0) {
					buffer[(y + 1) * width + (x - 1)] += err * (3 / 16);
				}
				buffer[(y + 1) * width + x] += err * (5 / 16);
				if (x + 1 < width) {
					buffer[(y + 1) * width + (x + 1)] += err * (1 / 16);
				}
			}
		}
	}

	const result = new Uint8Array(luminance.length);
	for (let i = 0; i < buffer.length; i++) {
		result[i] = Math.max(0, Math.min(255, Math.round(buffer[i])));
	}
	return result;
}
