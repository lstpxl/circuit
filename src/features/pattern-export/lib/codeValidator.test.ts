import { createGrid } from "../../pattern-generation/model/Generator";
import {
	validateCode,
	validateCodeStrict,
	getDimensionsFromCode,
} from "./codeValidator";
import { ValidationError } from "../../../entities/pattern/model/errors";
import { pattern2code } from "@/features/pattern-export/lib/encode";

describe("Code Validation", () => {
	// Generate a real valid code for testing
	let validCode: string;

	beforeAll(() => {
		// Create a simple pattern and encode it
		const testPattern = createGrid({
			width: 5,
			height: 5,
			density: 20,
			direction: "none",
			strength: 0,
			cohesion: 0,
		});

		validCode = pattern2code(testPattern, { width: 5, height: 5 });
	});

	describe("validateCode", () => {
		it("should return parsed result for valid code", () => {
			const result = validateCode(validCode);
			expect(result).toBeTruthy();
			if (result) {
				expect(result.width).toBe(5);
				expect(result.height).toBe(5);
				expect(result.binary).toBeDefined();
				expect(result.expectedLength).toBe(115); // 4*5*5 + 2*5 + 5
			}
		});

		it("should return false for invalid format", () => {
			expect(validateCode("invalid")).toBe(false);
			expect(validateCode("5x")).toBe(false);
			expect(validateCode("axbxc")).toBe(false);
		});

		it("should return false for dimensions out of range", () => {
			expect(validateCode("0x5xABC")).toBe(false);
			expect(validateCode("5x0xABC")).toBe(false);
			expect(validateCode("26x5xABC")).toBe(false);
			expect(validateCode("5x26xABC")).toBe(false);
		});

		it("should return false for incorrect base64 length", () => {
			expect(validateCode("5x5xABCDEF")).toBe(false); // Too short
			expect(validateCode("3x3xABCDEF")).toBe(false); // Wrong length for 3x3
		});
	});

	describe("validateCodeStrict", () => {
		it("should return parsed result for valid code", () => {
			const result = validateCodeStrict(validCode);
			expect(result.width).toBe(5);
			expect(result.height).toBe(5);
			expect(result.binary).toBeDefined();
			expect(result.expectedLength).toBe(115);
		});

		it("should throw ValidationError for invalid format", () => {
			expect(() => validateCodeStrict("invalid")).toThrow(ValidationError);

			try {
				validateCodeStrict("invalid");
			} catch (error) {
				expect(error).toBeInstanceOf(ValidationError);
				if (error instanceof ValidationError) {
					expect(error.field).toBe("format");
				}
			}
		});

		it("should throw ValidationError for base64 length mismatch", () => {
			expect(() => validateCodeStrict("5x5xABCDEF")).toThrow(ValidationError);

			try {
				validateCodeStrict("5x5xABCDEF");
			} catch (error) {
				expect(error).toBeInstanceOf(ValidationError);
				if (error instanceof ValidationError) {
					expect(error.field).toBe("base64");
					expect(error.message).toContain("length mismatch");
				}
			}
		});

		it("should throw ValidationError for invalid width", () => {
			expect(() => validateCodeStrict("0x5xABC")).toThrow(ValidationError);
			expect(() => validateCodeStrict("abc5xABC")).toThrow(ValidationError);
			expect(() => validateCodeStrict("26x5xABC")).toThrow(ValidationError);
		});

		it("should throw ValidationError for invalid height", () => {
			expect(() => validateCodeStrict("5x0xABC")).toThrow(ValidationError);
			expect(() => validateCodeStrict("5xabcxABC")).toThrow(ValidationError);
			expect(() => validateCodeStrict("5x26xABC")).toThrow(ValidationError);
		});
	});

	describe("getDimensionsFromCode", () => {
		it("should extract dimensions from valid code", () => {
			const result = getDimensionsFromCode("10x15xABCDEF");
			expect(result).toEqual({ width: 10, height: 15 });
		});

		it("should return false for invalid code", () => {
			expect(getDimensionsFromCode("invalid")).toBe(false);
			expect(getDimensionsFromCode("5x5x")).toBe(false);
		});
	});
});
