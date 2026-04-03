/**
 * @file Layout engine orchestrator.
 *
 * Dispatches to binary or shaded layout, then wraps the result with
 * the self-restoring code template. Preamble and postamble lines are
 * padded with art-matching content so the ENTIRE output is ASCII art.
 */

import {
	buildLine,
	buildLineComment,
	buildPostamble,
	buildPreamble,
} from "../code/template.js";
import type { LayoutMode, LuminanceGrid } from "../types.js";
import { layoutBinary } from "./binary.js";
import { layoutShaded } from "./shaded.js";

/** @brief Filler characters ordered from lightest to darkest visual weight. */
const FILLERS = [".", ":", "-", "~", "!", "*", "#", "@", "%"];

/**
 * @brief Count the number of dark cells in the grid.
 * @param grid      Luminance grid.
 * @param threshold Binarization threshold.
 * @returns Number of cells with luminance <= threshold.
 */
function countDarkCells(grid: LuminanceGrid, threshold: number): number {
	let count = 0;
	for (let i = 0; i < grid.data.length; i++) {
		if (grid.data[i] <= threshold) {
			count++;
		}
	}
	return count;
}

/**
 * @brief Select a filler character matching a luminance value.
 * @param luminance Pixel luminance (0=darkest, 255=lightest).
 * @returns Filler character of appropriate visual weight.
 */
function selectFiller(luminance: number): string {
	const maxIdx = FILLERS.length - 1;
	return FILLERS[Math.floor(((255 - luminance) / 255) * maxIdx)];
}

/**
 * @brief Pad a code line with art-matching content to a target width.
 *
 * For binary mode, pads with spaces.
 * For shaded mode, pads with a block comment containing luminance-matched
 * filler characters, so the line blends visually with the rest of the art.
 *
 * @param code        The JS code for this line.
 * @param row         Luminance values for the corresponding grid row.
 * @param gridWidth   Grid width (number of pixels per row).
 * @param targetWidth Desired total line width (matching payload lines).
 * @param mode        Layout mode.
 * @returns Formatted line with art-matching padding and `//` suffix.
 */
function padLineForArt(
	code: string,
	row: Uint8Array,
	gridWidth: number,
	targetWidth: number,
	mode: LayoutMode,
): string {
	const suffix = "//";
	const padLen = targetWidth - code.length - suffix.length;

	if (padLen <= 0) {
		return code + suffix;
	}

	if (mode === "binary") {
		return code + " ".repeat(padLen) + suffix;
	}

	// Shaded: block comment with luminance-matched fillers
	const commentOverhead = 4; // "/*" + "*/"
	if (padLen <= commentOverhead) {
		return code + " ".repeat(padLen) + suffix;
	}

	const fillerCount = padLen - commentOverhead;
	let fillers = "";
	for (let i = 0; i < fillerCount; i++) {
		const px = Math.min(
			Math.floor(((code.length + 2 + i) / targetWidth) * gridWidth),
			gridWidth - 1,
		);
		fillers += selectFiller(row[px]);
	}

	return `${code}/*${fillers}*/${suffix}`;
}

/**
 * @brief Generate executable ASCII art code from a payload and image grid.
 *
 * The entire output — including preamble and postamble — is formatted as
 * part of the ASCII art. Every line has the same width and ends with `//`.
 *
 * @param payload   Base64-encoded code payload.
 * @param grid      Luminance grid derived from the source image.
 * @param mode      Layout mode ("binary" or "shaded").
 * @param gzip      Whether the payload was gzip-compressed.
 * @param threshold Binarization threshold (0-255). @default 128
 * @returns Complete executable JavaScript source code.
 * @throws When the payload is too large to fit in the grid.
 */
export function layout(
	payload: string,
	grid: LuminanceGrid,
	mode: LayoutMode,
	gzip: boolean,
	threshold = 128,
): string {
	const darkCells = countDarkCells(grid, threshold);

	if (payload.length > darkCells) {
		throw new Error(
			`Payload too large for image: ${payload.length} chars needed, ` +
				`but only ${darkCells} dark cells available. ` +
				`Try increasing image width/height or raising the threshold.`,
		);
	}

	const contentLines =
		mode === "shaded"
			? layoutShaded(payload, grid, threshold)
			: layoutBinary(payload, grid, threshold);

	const comment = buildLineComment();
	const preambleCode = buildPreamble();
	const postambleCode = buildPostamble(mode, gzip);

	// Target width: the widest of payload lines, preamble, or postamble
	// Payload line = `;$_+="` (6) + content (gridWidth) + `"` (1) + `//` (2)
	const payloadLineWidth = grid.width + 9;
	const targetWidth = Math.max(
		payloadLineWidth,
		preambleCode.length + 2, // +2 for "//"
		postambleCode.length + 2,
	);

	const firstRow = grid.data.subarray(0, grid.width);
	const lastRow = grid.data.subarray(
		(grid.height - 1) * grid.width,
		grid.height * grid.width,
	);

	const output: string[] = [];

	// Preamble: art-padded to match the rest
	output.push(
		padLineForArt(preambleCode, firstRow, grid.width, targetWidth, mode),
	);

	// Payload content lines (padded to uniform width)
	const payloadPad = targetWidth - payloadLineWidth;
	const payloadSuffix =
		payloadPad > 0 ? " ".repeat(payloadPad) + comment : comment;
	for (const content of contentLines) {
		output.push(`${buildLine(content)}${payloadSuffix}`);
	}

	// Postamble: art-padded to match the rest
	output.push(
		padLineForArt(postambleCode, lastRow, grid.width, targetWidth, mode),
	);

	return output.join("\n");
}
