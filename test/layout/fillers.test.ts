import { describe, expect, it } from "vitest";
import { FILLERS, selectFiller } from "../../src/layout/fillers.js";

describe("fillers", () => {
	describe("FILLERS", () => {
		it("should contain only non-base64 characters", () => {
			for (const ch of FILLERS) {
				expect(ch).toMatch(/[^A-Za-z0-9+/=]/);
			}
		});

		it("should be ordered from lightest to darkest", () => {
			expect(FILLERS[0]).toBe(".");
			expect(FILLERS[FILLERS.length - 1]).toBe("%");
		});
	});

	describe("selectFiller", () => {
		it("should return darkest filler for luminance 0", () => {
			expect(selectFiller(0)).toBe(FILLERS[FILLERS.length - 1]);
		});

		it("should return lightest filler for luminance 255", () => {
			expect(selectFiller(255)).toBe(FILLERS[0]);
		});

		it("should return a mid-range filler for luminance 128", () => {
			const filler = selectFiller(128);
			expect(FILLERS).toContain(filler);
			// Should be roughly in the middle
			const idx = FILLERS.indexOf(filler);
			expect(idx).toBeGreaterThan(0);
			expect(idx).toBeLessThan(FILLERS.length - 1);
		});

		it("should always return a valid filler character", () => {
			for (let lum = 0; lum <= 255; lum++) {
				const filler = selectFiller(lum);
				expect(FILLERS).toContain(filler);
			}
		});
	});
});
