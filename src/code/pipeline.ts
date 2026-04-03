/**
 * @file Code transformation pipeline.
 *
 * Orchestrates: compress -> encode to produce a base64 payload string
 * ready for layout.
 */

import { compress } from "./compress.js";
import { encode } from "./encode.js";

/**
 * @brief Transform source code into a base64-encoded payload.
 *
 * @param code     JavaScript source code.
 * @param options  Pipeline options.
 * @returns Base64-encoded payload string.
 */
export async function transformCode(
	code: string,
	options: { compress?: boolean; gzip?: boolean },
): Promise<string> {
	const compressed = await compress(code, options.compress !== false);
	return encode(compressed, options.gzip ?? false);
}
