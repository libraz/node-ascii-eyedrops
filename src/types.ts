/**
 * @file Type definitions for @libraz/ascii-eyedrops.
 */

/** Layout mode for the generated code art. */
export type LayoutMode = "binary" | "shaded";

/**
 * Options for ASCII art generation.
 */
export interface AsciiOptions {
	/** @brief Width in characters. @default 120 */
	width?: number;
	/** @brief Height in rows. Auto-calculated from aspect ratio when omitted. */
	height?: number;
	/** @brief Binarization threshold (0-255). @default 128 */
	threshold?: number;
	/** @brief Invert light/dark mapping. @default false */
	invert?: boolean;
	/** @brief Contrast adjustment factor (0-2). @default 1 */
	contrast?: number;
	/** @brief Brightness adjustment factor (0-2). @default 1 */
	brightness?: number;
	/** @brief Gamma correction factor. @default 1 */
	gamma?: number;
	/** @brief Enable Floyd-Steinberg dithering. @default false */
	dither?: boolean;
	/** @brief Character set for imageToAscii standalone use. @default " .:-=+*#%@" */
	charset?: string;
}

/**
 * Options for the main transform API.
 */
export interface TransformOptions {
	/** @brief Source image for ASCII generation (file path or binary data). */
	image: string | Uint8Array;
	/** @brief ASCII generation settings. */
	ascii?: AsciiOptions;
	/** @brief Layout mode. @default "binary" */
	mode?: LayoutMode;
	/** @brief Minify code via terser before encoding. @default true */
	compress?: boolean;
	/** @brief Apply gzip compression before base64 encoding. @default false */
	gzip?: boolean;
}

/**
 * Decoded raw image pixel data.
 */
export interface RawImage {
	/** @brief RGBA pixel data as a flat array. */
	data: Uint8Array;
	/** @brief Image width in pixels. */
	width: number;
	/** @brief Image height in pixels. */
	height: number;
}

/**
 * Luminance grid derived from an image.
 * Each cell holds a luminance value (0-255) in row-major order.
 */
export interface LuminanceGrid {
	/** @brief Luminance values as a flat 1D array (row-major). */
	data: Uint8Array;
	/** @brief Grid width. */
	width: number;
	/** @brief Grid height. */
	height: number;
}

/**
 * Adapter interface for platform-specific image decoding.
 */
export interface ImageAdapter {
	/**
	 * @brief Decode an image and resize it to the target dimensions.
	 * @param input   File path, URL, or raw binary data.
	 * @param targetWidth  Desired output width in pixels.
	 * @param targetHeight Desired output height in pixels (auto if omitted).
	 * @returns Decoded RGBA pixel data.
	 */
	decode(
		input: string | Uint8Array,
		targetWidth: number,
		targetHeight?: number,
	): Promise<RawImage>;
}
