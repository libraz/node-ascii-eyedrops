/**
 * @file JavaScript code minification via terser.
 */

/**
 * @brief Minify JavaScript code using terser.
 *
 * Dynamically imports terser to keep it as an optional dependency.
 * Falls back to the original code on any failure.
 *
 * @param code    JavaScript source code.
 * @param enabled Whether minification is enabled.
 * @returns Minified code, or the original code if minification fails or is disabled.
 */
export async function compress(
	code: string,
	enabled: boolean,
): Promise<string> {
	if (!enabled) {
		return code;
	}

	try {
		const { minify } = await import("terser");
		const result = await minify(code, {
			compress: true,
			mangle: true,
			toplevel: true,
		});
		return result.code ?? code;
	} catch {
		return code;
	}
}
