/**
 * @file Code-to-base64 encoding with optional gzip compression.
 */

import { textToBase64, toBase64 } from "../util/base64.js";
import { gzipEncode } from "../util/gzip.js";

/**
 * @brief Encode a code string to base64, optionally with gzip pre-compression.
 *
 * When gzip is enabled, the code is first compressed with gzip, then
 * base64-encoded. The output contains only base64-safe characters
 * (A-Za-z0-9+/=).
 *
 * @param code JavaScript source code to encode.
 * @param gzip Whether to apply gzip compression before base64 encoding.
 * @returns Base64-encoded payload string.
 */
export async function encode(code: string, gzip: boolean): Promise<string> {
	if (!gzip) {
		return textToBase64(code);
	}

	const compressed = await gzipEncode(new TextEncoder().encode(code));
	return toBase64(compressed);
}
