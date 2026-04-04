/**
 * @file Environment detection utilities.
 */

/** @brief Whether the current runtime is Node.js. */
export const isNode =
	typeof process !== "undefined" && process.versions?.node !== undefined;
