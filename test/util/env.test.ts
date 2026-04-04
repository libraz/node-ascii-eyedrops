import { describe, expect, it } from "vitest";
import { isNode } from "../../src/util/env.js";

describe("env", () => {
	it("should detect Node.js environment", () => {
		expect(isNode).toBe(true);
	});
});
