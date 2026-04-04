/**
 * @file Node.js image adapter using sharp.
 */

import type { ImageAdapter, RawImage } from "../../types.js";
import { ASPECT_CORRECTION } from "./constants.js";

/**
 * @brief Image adapter backed by the sharp library (Node.js).
 *
 * Dynamically imports sharp to avoid hard dependency in browser builds.
 */
export class SharpAdapter implements ImageAdapter {
	/**
	 * @brief Decode and resize an image using sharp.
	 * @param input       File path or raw binary data.
	 * @param targetWidth Desired output width in pixels.
	 * @param targetHeight Desired output height (auto-calculated if omitted).
	 * @returns Decoded RGBA pixel data at the target dimensions.
	 */
	async decode(
		input: string | Uint8Array,
		targetWidth: number,
		targetHeight?: number,
	): Promise<RawImage> {
		const sharp = (await import("sharp")).default;

		const image = sharp(typeof input === "string" ? input : Buffer.from(input));

		if (targetHeight === undefined) {
			const metadata = await image.metadata();
			if (!metadata.width || !metadata.height) {
				throw new Error("Failed to read image metadata");
			}
			targetHeight = Math.round(
				metadata.height * (targetWidth / metadata.width) * ASPECT_CORRECTION,
			);
		}

		const { data, info } = await image
			.resize({ width: targetWidth, height: targetHeight, fit: "fill" })
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });

		return {
			data: new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
			width: info.width,
			height: info.height,
		};
	}
}
