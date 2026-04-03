/**
 * @file Luminance-to-character mapping for standalone ASCII art generation.
 */

/** @brief Default character set ordered from lightest to darkest. */
export const DEFAULT_CHARSET = " .:-=+*#%@";

/**
 * @brief Map a luminance array to an ASCII art string.
 *
 * Each luminance value is mapped to a character from the charset based
 * on its intensity. Lower luminance (darker) maps to denser characters.
 *
 * @param luminance Luminance values (0-255), row-major.
 * @param width     Number of columns per row.
 * @param charset   Character set ordered from lightest to darkest.
 * @returns Multi-line ASCII art string.
 */
export function mapToChars(
	luminance: Uint8Array,
	width: number,
	charset: string = DEFAULT_CHARSET,
): string {
	const chars = charset.length > 0 ? charset : DEFAULT_CHARSET;
	const maxIdx = chars.length - 1;
	const height = Math.floor(luminance.length / width);
	const lines: string[] = [];

	for (let y = 0; y < height; y++) {
		let line = "";
		for (let x = 0; x < width; x++) {
			const value = luminance[y * width + x];
			const idx = Math.floor((value / 255) * maxIdx);
			line += chars[idx];
		}
		lines.push(line);
	}

	return lines.join("\n");
}
