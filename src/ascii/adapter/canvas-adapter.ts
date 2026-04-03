/**
 * @file Browser image adapter using Canvas/OffscreenCanvas API.
 *
 * This module targets browser environments only. It uses DOM types
 * that are not available under Node.js type-checking.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ImageAdapter, RawImage } from "./types.js";

/** @brief Terminal character aspect ratio correction factor. */
const ASPECT_CORRECTION = 0.5;

/** @brief Type aliases for browser globals not present in Node type definitions. */
declare const OffscreenCanvas: any;
declare const document: any;
declare function createImageBitmap(source: any): Promise<any>;

/**
 * @brief Image adapter backed by the browser Canvas API.
 *
 * Uses OffscreenCanvas when available, falls back to document.createElement.
 */
export class CanvasAdapter implements ImageAdapter {
	/**
	 * @brief Decode and resize an image using browser Canvas.
	 * @param input        Image URL, data URI, or raw binary data.
	 * @param targetWidth  Desired output width in pixels.
	 * @param targetHeight Desired output height (auto-calculated if omitted).
	 * @returns Decoded RGBA pixel data at the target dimensions.
	 */
	async decode(
		input: string | Uint8Array,
		targetWidth: number,
		targetHeight?: number,
	): Promise<RawImage> {
		let source: Blob;

		if (typeof input === "string") {
			const response = await fetch(input);
			source = await response.blob();
		} else {
			source = new Blob([input as unknown as ArrayBuffer]);
		}

		const bitmap = await createImageBitmap(source);

		if (targetHeight === undefined) {
			targetHeight = Math.round(
				bitmap.height * (targetWidth / bitmap.width) * ASPECT_CORRECTION,
			);
		}

		let canvas: any;
		let ctx: any;

		if (typeof OffscreenCanvas !== "undefined") {
			canvas = new OffscreenCanvas(targetWidth, targetHeight);
			ctx = canvas.getContext("2d");
		} else if (typeof document !== "undefined") {
			canvas = (document as any).createElement("canvas");
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			ctx = canvas.getContext("2d");
		} else {
			throw new Error(
				"No Canvas API available. Use Node.js with sharp instead.",
			);
		}

		if (!ctx) {
			throw new Error("Failed to obtain 2D rendering context");
		}

		ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
		const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

		return {
			data: new Uint8Array(imageData.data.buffer),
			width: targetWidth,
			height: targetHeight,
		};
	}
}
