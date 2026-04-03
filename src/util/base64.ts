/**
 * @file Cross-environment base64 encoding/decoding utilities.
 *
 * Uses Node.js Buffer when available, falls back to browser-native
 * btoa/atob otherwise.
 */

const isNode =
	typeof process !== "undefined" && process.versions?.node !== undefined;

/**
 * @brief Encode a byte array to a base64 string.
 * @param data Raw bytes to encode.
 * @returns Base64-encoded string.
 */
export function toBase64(data: Uint8Array): string {
	if (isNode) {
		return Buffer.from(data).toString("base64");
	}
	let binary = "";
	for (let i = 0; i < data.length; i++) {
		binary += String.fromCharCode(data[i]);
	}
	return btoa(binary);
}

/**
 * @brief Decode a base64 string to a byte array.
 * @param str Base64-encoded string.
 * @returns Decoded bytes.
 */
export function fromBase64(str: string): Uint8Array {
	if (isNode) {
		return new Uint8Array(Buffer.from(str, "base64"));
	}
	const binary = atob(str);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

/**
 * @brief Encode a UTF-8 string to base64.
 * @param text UTF-8 string.
 * @returns Base64-encoded string.
 */
export function textToBase64(text: string): string {
	return toBase64(new TextEncoder().encode(text));
}

/**
 * @brief Decode a base64 string to a UTF-8 string.
 * @param b64 Base64-encoded string.
 * @returns Decoded UTF-8 string.
 */
export function base64ToText(b64: string): string {
	return new TextDecoder().decode(fromBase64(b64));
}
