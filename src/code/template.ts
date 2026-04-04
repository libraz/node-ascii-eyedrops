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
	return 'var $_="",R=/[^\\w+\\/=]/g';
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
 * @brief The strip regex variable name used in generated code.
 *
 * The regex itself is defined in the preamble as `R=/[^\w+\/=]/g`.
 * Uses `\w` ([A-Za-z0-9_]) instead of `[A-Za-z0-9]` for brevity.
 * Safe because `_` never appears in filler/padding characters.
 */
const STRIP_VAR = "R";

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
		return `;eval(atob($_.replace(${STRIP_VAR},"")))`;
	}

	// Gzip: synchronous decompression via zlib.gunzipSync
	return (
		`;eval(require("zlib").gunzipSync(` +
		`Buffer.from($_.replace(${STRIP_VAR},""),"base64")` +
		`).toString())`
	);
}
