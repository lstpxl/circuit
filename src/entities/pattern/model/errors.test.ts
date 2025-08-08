import {
	InvalidCodeError,
	GridCreationError,
	EncodingError,
	ValidationError,
} from "./errors";

describe("Custom Error Classes", () => {
	describe("InvalidCodeError", () => {
		it("should create error with code and expected format", () => {
			const error = new InvalidCodeError(
				"Invalid format",
				"bad-code",
				"WIDTHxHEIGHTxBASE64",
			);

			expect(error.name).toBe("InvalidCodeError");
			expect(error.message).toBe("Invalid format");
			expect(error.code).toBe("bad-code");
			expect(error.expectedFormat).toBe("WIDTHxHEIGHTxBASE64");
			expect(error).toBeInstanceOf(Error);
		});

		it("should maintain proper stack trace", () => {
			const error = new InvalidCodeError("Test", "code");
			expect(error.stack).toBeDefined();
		});
	});

	describe("GridCreationError", () => {
		it("should create error with dimensions and original error", () => {
			const originalError = new Error("Original");
			const dimensions = { width: 5, height: 5 };

			const error = new GridCreationError(
				"Grid failed",
				"test-code",
				dimensions,
				originalError,
			);

			expect(error.name).toBe("GridCreationError");
			expect(error.dimensions).toEqual(dimensions);
			expect(error.originalError).toBe(originalError);
		});
	});

	describe("ValidationError", () => {
		it("should create error with field and constraint info", () => {
			const error = new ValidationError(
				"Width invalid",
				"width",
				"abc",
				"1-25",
			);

			expect(error.field).toBe("width");
			expect(error.value).toBe("abc");
			expect(error.constraint).toBe("1-25");
		});
	});

	describe("EncodingError", () => {
		it("should create error with operation type", () => {
			const error = new EncodingError("Decode failed", "deserialize");

			expect(error.operation).toBe("deserialize");
			expect(error.name).toBe("EncodingError");
		});
	});
});
