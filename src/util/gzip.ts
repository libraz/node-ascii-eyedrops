/**
 * @file Cross-environment gzip compression/decompression.
 *
 * Uses Node.js zlib when available, falls back to pako for browser
 * environments.
 */

const isNode =
	typeof process !== "undefined" && process.versions?.node !== undefined;

/**
 * @brief Compress data with gzip.
 * @param data Raw bytes to compress.
 * @returns Gzip-compressed bytes.
 */
export async function gzipEncode(data: Uint8Array): Promise<Uint8Array> {
	if (isNode) {
		const { promisify } = await import("node:util");
		const { gzip } = await import("node:zlib");
		const result = await promisify(gzip)(Buffer.from(data));
		return new Uint8Array(result);
	}
	const { deflate } = await import("pako");
	return deflate(data, { level: 9 });
}

/**
 * @brief Decompress gzip data.
 * @param data Gzip-compressed bytes.
 * @returns Decompressed bytes.
 */
export async function gzipDecode(data: Uint8Array): Promise<Uint8Array> {
	if (isNode) {
		const { promisify } = await import("node:util");
		const { gunzip } = await import("node:zlib");
		const result = await promisify(gunzip)(Buffer.from(data));
		return new Uint8Array(result);
	}
	const { inflate } = await import("pako");
	return inflate(data);
}
