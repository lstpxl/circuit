import { reportError } from "./reportError";
import {
	InvalidCodeError,
	GridCreationError,
} from "@/entities/pattern/model/errors";

// Mock console.error
const consoleSpy = jest.spyOn(console, "error").mockImplementation();

describe("reportError", () => {
	beforeEach(() => {
		consoleSpy.mockClear();
	});

	afterAll(() => {
		consoleSpy.mockRestore();
	});

	it("should log basic error information", () => {
		const error = new Error("Test error");
		const report = reportError(error);

		expect(report.name).toBe("Error");
		expect(report.message).toBe("Test error");
		expect(report.context.timestamp).toBeDefined();
		expect(consoleSpy).toHaveBeenCalledWith("Error Report:", report);
	});

	it("should add specific context for InvalidCodeError", () => {
		const error = new InvalidCodeError(
			"Bad code",
			"test-code",
			"WIDTHxHEIGHTxBASE64",
		);
		const report = reportError(error);

		expect(report.context.errorType).toBe("InvalidCode");
		expect(report.context.invalidCode).toBe("test-code");
		expect(report.context.expectedFormat).toBe("WIDTHxHEIGHTxBASE64");
	});

	it("should add specific context for GridCreationError", () => {
		const dimensions = { width: 5, height: 5 };
		const originalError = new Error("Original");
		const error = new GridCreationError(
			"Grid failed",
			"code",
			dimensions,
			originalError,
		);

		const report = reportError(error);

		expect(report.context.errorType).toBe("GridCreation");
		expect(report.context.code).toBe("code");
		expect(report.context.dimensions).toEqual(dimensions);
		expect(report.context.originalError).toBe("Original");
	});

	it("should include additional context when provided", () => {
		const error = new Error("Test");
		const additionalContext = { userId: "123", action: "generate" };

		const report = reportError(error, additionalContext);

		expect(report.context.userId).toBe("123");
		expect(report.context.action).toBe("generate");
	});
});
