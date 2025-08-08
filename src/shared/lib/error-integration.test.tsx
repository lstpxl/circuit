import { render, screen } from "@testing-library/react";
import { InvalidCodeError } from "@/entities/pattern/model/errors";
import { ErrorBoundary } from "../ui/error-boundary/ErrorBoundary";

// Component that throws errors for testing
const ErrorThrowingComponent = ({ errorType }: { errorType: string }) => {
	if (errorType === "invalid-code") {
		throw new InvalidCodeError("Test error", "bad-code", "WIDTHxHEIGHTxBASE64");
	}
	return <div>No error</div>;
};

describe("Error Integration", () => {
	// Mock console.error to suppress React error boundary logs
	const originalError = console.error;

	beforeAll(() => {
		console.error = jest.fn();
	});

	afterAll(() => {
		console.error = originalError;
	});

	beforeEach(() => {
		// Clear mock calls between tests
		(console.error as jest.Mock).mockClear();
	});

	it("should display InvalidCodeError boundary correctly", () => {
		render(
			<ErrorBoundary>
				<ErrorThrowingComponent errorType="invalid-code" />
			</ErrorBoundary>,
		);

		expect(screen.getByText(/Invalid Pattern Code/)).toBeInTheDocument();
		expect(screen.getByText(/Try Again/)).toBeInTheDocument();

		// Optionally verify that console.error was called
		expect(console.error).toHaveBeenCalled();
	});

	it("should display normal content when no error", () => {
		render(
			<ErrorBoundary>
				<ErrorThrowingComponent errorType="none" />
			</ErrorBoundary>,
		);

		expect(screen.getByText("No error")).toBeInTheDocument();

		// Verify no error was logged
		expect(console.error).not.toHaveBeenCalled();
	});

	it("should handle error boundary retry functionality", () => {
		const { rerender } = render(
			<ErrorBoundary>
				<ErrorThrowingComponent errorType="invalid-code" />
			</ErrorBoundary>,
		);

		expect(screen.getByText(/Invalid Pattern Code/)).toBeInTheDocument();

		// Click retry button
		const retryButton = screen.getByText(/Try Again/);
		retryButton.click();

		// Rerender with no error
		rerender(
			<ErrorBoundary>
				<ErrorThrowingComponent errorType="none" />
			</ErrorBoundary>,
		);

		expect(screen.getByText("No error")).toBeInTheDocument();
	});
});
