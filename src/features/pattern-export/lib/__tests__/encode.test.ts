import {
	createGridFromCode,
	pattern2code,
	serializeGrid,
	bin2base64,
	bareBin2base64,
} from "../encode";
import { createGrid } from "../../../pattern-generation/model/Generator";
import { WIND_DIRECTIONS } from "@/features/pattern-generation";
import { InvalidCodeError } from "../../../../entities/pattern/model/errors";
import type { Line, Dimensions } from "@/entities/pattern/model/types";

describe("Pattern Encoding/Decoding", () => {
	let validCode: string;
	let testPattern: Line[];
	let testDimensions: Dimensions;

	beforeAll(() => {
		// Create a simple pattern for testing
		testDimensions = { width: 3, height: 3 };
		testPattern = createGrid({
			width: testDimensions.width,
			height: testDimensions.height,
			density: 20,
			direction: WIND_DIRECTIONS.None,
			strength: 0,
			cohesion: 0,
		});
		validCode = pattern2code(testPattern, testDimensions);
	});

	describe("serializeGrid", () => {
		it("should serialize empty grid correctly", () => {
			const emptyPattern: Line[] = [];
			const dimensions = { width: 2, height: 2 };
			const result = serializeGrid(emptyPattern, dimensions);
			// 2x2 grid: 4*2*2 + 2*2 + 2 = 22 bits
			expect(result).toBe("0000000000000000000000");
			expect(result.length).toBe(22);
		});

		it("should serialize grid with lines correctly", () => {
			const pattern: Line[] = [
				{ x: 0, y: 0, dir: "r", status: true },
				{ x: 1, y: 1, dir: "d", status: true },
			];
			const dimensions = { width: 2, height: 2 };
			const result = serializeGrid(pattern, dimensions);
			expect(result.length).toBe(22);
			expect(result[0]).toBe("1"); // First line at (0,0) dir "r"
			expect(result[14]).toBe("1"); // Line at (1,1) dir "d"
		});
	});

	describe("bareBin2base64", () => {
		it("should handle empty string", () => {
			expect(bareBin2base64("")).toBe("");
		});

		it("should encode binary string to URL-safe base64", () => {
			const binary = "01001000011001010110110001101100011011110000000000000000";
			const result = bareBin2base64(binary);
			expect(result).toBeTruthy();
			expect(result).not.toContain("+");
			expect(result).not.toContain("/");
			expect(result).not.toContain("=");
		});

		it("should handle binary strings not divisible by 8", () => {
			const binary = "0100100001100101011011000110110001101111";
			const result = bareBin2base64(binary);
			expect(result).toBeTruthy();
		});
	});

	describe("bin2base64", () => {
		it("should create formatted code with dimensions", () => {
			const binary =
				"0100100001100101011011000110110001101111000000000000000000000000000000000000000000000000000000000000000000000000000";
			const dimensions = { width: 5, height: 5 };
			const result = bin2base64(binary, dimensions);
			expect(result).toMatch(/^\d+x\d+x[A-Za-z0-9_-]+$/);
			expect(result).toContain("5x5x");
		});

		it("should throw error on empty binary", () => {
			expect(() => bin2base64("", { width: 1, height: 1 })).toThrow();
		});
	});

	describe("pattern2code", () => {
		it("should encode pattern to valid code format", () => {
			const result = pattern2code(testPattern, testDimensions);
			expect(result).toMatch(/^\d+x\d+x[A-Za-z0-9_-]*$/);
			expect(result).toContain("3x3x");
		});

		it("should be deterministic", () => {
			const result1 = pattern2code(testPattern, testDimensions);
			const result2 = pattern2code(testPattern, testDimensions);
			expect(result1).toBe(result2);
		});

		it("should handle empty pattern", () => {
			const emptyPattern: Line[] = [];
			const dimensions = { width: 2, height: 2 };
			const result = pattern2code(emptyPattern, dimensions);
			expect(result).toMatch(/^2x2x[A-Za-z0-9_-]*$/);
		});
	});

	describe("createGridFromCode", () => {
		it("should throw InvalidCodeError for malformed code", () => {
			expect(() => createGridFromCode("invalid")).toThrow(InvalidCodeError);

			try {
				createGridFromCode("invalid");
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidCodeError);
				if (error instanceof InvalidCodeError) {
					expect(error.code).toBe("invalid");
				}
			}
		});

		it("should throw InvalidCodeError for invalid format", () => {
			expect(() => createGridFromCode("5x")).toThrow(InvalidCodeError);
			expect(() => createGridFromCode("axbxc")).toThrow(InvalidCodeError);
		});

		it("should throw InvalidCodeError for dimensions out of range", () => {
			expect(() => createGridFromCode("0x5xABC")).toThrow(InvalidCodeError);
			expect(() => createGridFromCode("26x5xABC")).toThrow(InvalidCodeError);
		});

		it("should throw error for corrupted base64", () => {
			expect(() => createGridFromCode("2x2x!!!")).toThrow();
		});

		it("should return grid result for valid code", () => {
			const result = createGridFromCode(validCode);
			expect(result.lines).toBeDefined();
			expect(result.dimensions).toBeDefined();
			expect(result.dimensions.width).toBe(3);
			expect(result.dimensions.height).toBe(3);
			expect(Array.isArray(result.lines)).toBe(true);
		});

		it("should handle minimal valid code", () => {
			// Create a minimal 1x1 grid code
			const minimalPattern: Line[] = [];
			const minimalDimensions = { width: 1, height: 1 };
			const minimalCode = pattern2code(minimalPattern, minimalDimensions);

			const result = createGridFromCode(minimalCode);
			expect(result.dimensions).toEqual(minimalDimensions);
			expect(result.lines).toBeDefined();
		});
	});

	describe("Round-trip encoding/decoding", () => {
		it("should successfully round-trip encode and decode", () => {
			const originalPattern = testPattern;
			const originalDimensions = testDimensions;

			// Encode
			const code = pattern2code(originalPattern, originalDimensions);

			// Decode
			const decoded = createGridFromCode(code);

			expect(decoded.dimensions).toEqual(originalDimensions);
			expect(decoded.lines).toBeDefined();

			// Re-encode to verify consistency
			const reEncoded = pattern2code(decoded.lines, decoded.dimensions);

			expect(reEncoded).toBe(code);
		});

		it("should handle various grid sizes", () => {
			const testSizes = [
				{ width: 1, height: 1 },
				{ width: 2, height: 3 },
				{ width: 5, height: 2 },
				{ width: 10, height: 10 },
			];

			for (const dimensions of testSizes) {
				const pattern = createGrid({
					width: dimensions.width,
					height: dimensions.height,
					density: 10,
					direction: WIND_DIRECTIONS.None,
					strength: 0,
					cohesion: 0,
				});

				const code = pattern2code(pattern, dimensions);
				const decoded = createGridFromCode(code);

				expect(decoded.dimensions).toEqual(dimensions);

				const reEncoded = pattern2code(decoded.lines, decoded.dimensions);
				expect(reEncoded).toBe(code);
			}
		});

		it("should produce different codes for different patterns", () => {
			const pattern1 = createGrid({
				width: 3,
				height: 3,
				density: 10,
				direction: WIND_DIRECTIONS.None,
				strength: 0,
				cohesion: 0,
			});

			const pattern2 = createGrid({
				width: 3,
				height: 3,
				density: 50,
				direction: WIND_DIRECTIONS.DiagonalBackslash,
				strength: 5,
				cohesion: 3,
			});

			const code1 = pattern2code(pattern1, { width: 3, height: 3 });
			const code2 = pattern2code(pattern2, { width: 3, height: 3 });

			// They should be different (unless we get extremely unlucky)
			if (
				pattern1.length !== pattern2.length ||
				!pattern1.every(
					(line, i) =>
						pattern2[i] &&
						line.x === pattern2[i].x &&
						line.y === pattern2[i].y &&
						line.dir === pattern2[i].dir,
				)
			) {
				expect(code1).not.toBe(code2);
			}
		});
	});

	describe("Error handling", () => {
		it("should throw GridCreationError for binary length mismatch", () => {
			// This would require mocking validateCodeStrict to return invalid binary length
			// For now, we test through invalid base64 that produces wrong binary length
			expect(() => createGridFromCode("2x2xA")).toThrow();
		});

		it("should preserve error details in InvalidCodeError", () => {
			try {
				createGridFromCode("invalid-format");
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidCodeError);
				if (error instanceof InvalidCodeError) {
					expect(error.code).toBe("invalid-format");
					expect(error.message).toBeTruthy();
				}
			}
		});
	});

	describe("Second round-trip encoding/decoding", () => {
		it("should successfully round-trip encode and decode", () => {
			// Use a deterministic pattern instead of random
			const originalPattern: Line[] = [
				{ x: 0, y: 0, dir: "r", status: true },
				{ x: 1, y: 1, dir: "d", status: true },
				{ x: 2, y: 2, dir: "a", status: true },
			];
			const originalDimensions = { width: 3, height: 3 };

			// Encode
			const code = pattern2code(originalPattern, originalDimensions);

			// Decode
			const decoded = createGridFromCode(code);

			expect(decoded.dimensions).toEqual(originalDimensions);
			expect(decoded.lines).toBeDefined();

			// Re-encode to verify consistency
			const reEncoded = pattern2code(decoded.lines, decoded.dimensions);

			expect(reEncoded).toBe(code);
		});

		it("should handle the original random pattern case", () => {
			// Keep the original test but make it more flexible
			const originalPattern = testPattern;
			const originalDimensions = testDimensions;

			const code = pattern2code(originalPattern, originalDimensions);

			const decoded = createGridFromCode(code);

			expect(decoded.dimensions).toEqual(originalDimensions);

			// Instead of checking exact string equality, verify the patterns are functionally equivalent
			const reEncoded = pattern2code(decoded.lines, decoded.dimensions);

			// The key test: decode both codes and they should produce identical results
			const decoded1 = createGridFromCode(code);
			const decoded2 = createGridFromCode(reEncoded);

			expect(decoded1.lines.length).toBe(decoded2.lines.length);
			expect(decoded1.dimensions).toEqual(decoded2.dimensions);

			// Sort both arrays to compare regardless of order
			const sortLines = (lines: Line[]) =>
				lines.sort(
					(a, b) => a.x - b.x || a.y - b.y || a.dir.localeCompare(b.dir),
				);

			expect(sortLines([...decoded1.lines])).toEqual(
				sortLines([...decoded2.lines]),
			);
		});
	});
});
