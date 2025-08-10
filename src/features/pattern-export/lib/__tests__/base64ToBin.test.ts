import { base64ToBin } from "../base64ToBin";

describe("base64ToBin", () => {
	it("decodes valid code with correct dimensions", () => {
		const result = base64ToBin("3x3xQUlE", { width: 3, height: 3 });
		expect(typeof result).toBe("string");
		expect(result.length).toBeGreaterThan(0);
		// Result should be a binary string containing only 0s and 1s
		expect(/^[01]*$/.test(result)).toBe(true);
	});

	it("handles different dimensions correctly", () => {
		const result = base64ToBin("2x2xQQ", { width: 2, height: 2 });
		expect(typeof result).toBe("string");
		expect(/^[01]*$/.test(result)).toBe(true);
	});

	it("throws error for invalid format", () => {
		expect(() => base64ToBin("invalid", { width: 3, height: 3 })).toThrow(
			"Invalid base64 format",
		);
	});

	it("throws error for dimension mismatch", () => {
		expect(() => base64ToBin("3x3xQUlE", { width: 2, height: 2 })).toThrow(
			"Grid dimensions do not match",
		);
	});

	it("throws error for missing dimensions in code", () => {
		expect(() => base64ToBin("QUlE", { width: 3, height: 3 })).toThrow(
			"Invalid base64 format",
		);
	});

	it("handles URL-safe base64 characters", () => {
		// Test with URL-safe characters (- and _)
		const result = base64ToBin("2x2xQ-_A", { width: 2, height: 2 });
		expect(typeof result).toBe("string");
		expect(/^[01]*$/.test(result)).toBe(true);
	});
});
