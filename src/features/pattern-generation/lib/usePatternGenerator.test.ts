import { renderHook, act } from "@testing-library/react";
import { usePatternGenerator } from "./usePatternGenerator";
import * as encode from "@/features/pattern-export/lib/encode";
import {
	InvalidCodeError,
	GridCreationError,
	EncodingError,
} from "@/entities/pattern/model/errors";

// Mock the encode module
jest.mock("@/model/encode");
const mockCreateGridFromCode = jest.mocked(encode.createGridFromCode);

// Mock console.error to suppress expected error logs
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("usePatternGenerator", () => {
	const mockInitialPattern = {
		width: 3,
		height: 3,
		lines: [],
	};

	beforeEach(() => {
		jest.clearAllMocks();
		consoleSpy.mockClear();
	});

	afterAll(() => {
		consoleSpy.mockRestore();
	});

	it("should handle code generation errors gracefully", () => {
		const { result } = renderHook(() =>
			usePatternGenerator(mockInitialPattern),
		);

		mockCreateGridFromCode.mockImplementation(() => {
			throw new InvalidCodeError("Invalid code", "bad-code");
		});

		act(() => {
			result.current.generateFromCode("bad-code");
		});

		expect(result.current.validationError).toContain("Invalid code format");
	});

	it("should clear validation error on successful generation", () => {
		const { result } = renderHook(() =>
			usePatternGenerator(mockInitialPattern),
		);

		mockCreateGridFromCode.mockReturnValue({
			lines: [],
			dimensions: { width: 5, height: 5 },
		});

		act(() => {
			result.current.generateFromCode("valid-code");
		});

		expect(result.current.validationError).toBeNull();
	});

	it("should handle grid creation errors", () => {
		const { result } = renderHook(() =>
			usePatternGenerator(mockInitialPattern),
		);

		mockCreateGridFromCode.mockImplementation(() => {
			throw new GridCreationError("Grid creation failed", "test-code");
		});

		act(() => {
			result.current.generateFromCode("test-code");
		});

		expect(result.current.validationError).toContain(
			"Failed to create pattern",
		);
	});

	it("should handle encoding errors", () => {
		const { result } = renderHook(() =>
			usePatternGenerator(mockInitialPattern),
		);

		mockCreateGridFromCode.mockImplementation(() => {
			throw new EncodingError("Encoding failed", "deserialize");
		});

		act(() => {
			result.current.generateFromCode("test-code");
		});

		expect(result.current.validationError).toContain(
			"Encoding error during deserialize",
		);
	});

	it("should handle unknown errors", () => {
		const { result } = renderHook(() =>
			usePatternGenerator(mockInitialPattern),
		);

		mockCreateGridFromCode.mockImplementation(() => {
			throw new Error("Unknown error");
		});

		act(() => {
			result.current.generateFromCode("test-code");
		});

		expect(result.current.validationError).toBe("An unexpected error occurred");

		// Verify that console.error was called with the expected arguments
		expect(consoleSpy).toHaveBeenCalledWith(
			"Unexpected error:",
			expect.any(Error),
		);
	});
});
