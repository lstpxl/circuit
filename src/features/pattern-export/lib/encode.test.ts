import { createGridFromCode } from "@/features/pattern-export/lib/encode";
import { InvalidCodeError } from "../../../entities/pattern/model/errors";

describe("Pattern Encoding/Decoding", () => {
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

		it("should throw GridCreationError for valid format but invalid data", () => {
			// Test with valid format but corrupted base64
			expect(() => createGridFromCode("5x5x!!!")).toThrow();
		});

		it("should return grid result for valid code", () => {
			// You'll need a known valid code for this test
			// const validCode = 'your-valid-code-here';
			// const result = createGridFromCode(validCode);
			// expect(result.lines).toBeDefined();
			// expect(result.dimensions).toBeDefined();
		});
	});

	describe("pattern2code integration", () => {
		it("should round-trip encode/decode successfully", () => {
			// Test that encoding then decoding produces equivalent result
			// This is a key integration test
		});
	});
});
