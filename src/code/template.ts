/**
 * @file Self-restoring code template generation.
 *
 * Generates the preamble, per-line wrapper, and postamble fragments
 * that make the output a valid, executable JavaScript program.
 */

import type { LayoutMode } from "../types.js";

/**
 * @brief Generate the preamble code that initializes the payload accumulator.
 * @returns JavaScript statement: `var $_=""`
 */
export function buildPreamble(): string {
	return 'var $_=""';
}

/**
 * @brief Wrap a line's content as a string-concatenation statement.
 * @param content The content to embed (payload chars + spaces/fillers).
 * @returns JavaScript statement: `;$_+="<content>"`
 */
export function buildLine(content: string): string {
	return `;$_+="${content}"`;
}

/**
 * @brief Generate the line-end comment marker.
 * @returns `//`
 */
export function buildLineComment(): string {
	return "//";
}

/**
 * @brief The strip regex pattern used in generated code.
 *
 * Strips all non-base64 characters (spaces, fillers, dark-padding).
 * Unified across both binary and shaded modes.
 */
const STRIP_PATTERN = "/[^A-Za-z0-9+\\/=]/g";

/**
 * @brief Generate the postamble code that decodes and executes the payload.
 *
 * Uses `eval(atob(...))` for non-gzip (Node 16+ supports global atob).
 * Uses a self-executing function with DecompressionStream/zlib for gzip.
 *
 * @param mode Layout mode ("binary" or "shaded").
 * @param gzip Whether gzip decompression is needed.
 * @returns JavaScript code string (without line comment suffix).
 */
export function buildPostamble(_mode: LayoutMode, gzip: boolean): string {
	if (!gzip) {
		return `;eval(atob($_.replace(${STRIP_PATTERN},"")))`;
	}

	// Gzip: synchronous decompression via zlib.gunzipSync
	return (
		`;eval(require("zlib").gunzipSync(` +
		`Buffer.from($_.replace(${STRIP_PATTERN},""),"base64")` +
		`).toString())`
	);
}
