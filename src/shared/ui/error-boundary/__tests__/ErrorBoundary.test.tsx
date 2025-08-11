import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "../ErrorBoundary";
import {
	InvalidCodeError,
	GridCreationError,
} from "@/entities/pattern/model/errors";
import React from "react";

// Helper component to throw errors for testing purposes
function ProblemChild({ errorToThrow }: { errorToThrow?: Error }) {
	if (errorToThrow) {
		throw errorToThrow;
	}
	return <div>Children rendered successfully</div>;
}

describe("ErrorBoundary", () => {
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		// Mock console.error to prevent polluting the test output
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	it("should render children when there is no error", () => {
		render(
			<ErrorBoundary>
				<ProblemChild />
			</ErrorBoundary>,
		);
		expect(
			screen.getByText("Children rendered successfully"),
		).toBeInTheDocument();
	});

	it("should catch a generic error and render the default fallback", () => {
		const genericError = new Error("Something bad happened");
		render(
			<ErrorBoundary>
				<ProblemChild errorToThrow={genericError} />
			</ErrorBoundary>,
		);

		expect(
			screen.getByRole("heading", { name: /something went wrong/i }),
		).toBeInTheDocument();
		expect(screen.getByText(genericError.message)).toBeInTheDocument();
		expect(
			screen.queryByText("Children rendered successfully"),
		).not.toBeInTheDocument();
	});

	it("should catch an InvalidCodeError and render the specific fallback", () => {
		const invalidCodeError = new InvalidCodeError("Invalid code", "code");
		// Manually add the property that the component expects to render
		Object.assign(invalidCodeError, { expectedFormat: "A1-B2-C3" });

		render(
			<ErrorBoundary>
				<ProblemChild errorToThrow={invalidCodeError} />
			</ErrorBoundary>,
		);

		expect(
			screen.getByRole("heading", { name: /invalid pattern code/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(invalidCodeError.expectedFormat ?? ""),
		).toBeInTheDocument();
	});

	it("should catch a GridCreationError and render the specific fallback", () => {
		const gridError = new GridCreationError("Grid failed");
		// Manually add the property that the component expects to render
		Object.assign(gridError, { dimensions: { width: 10, height: 20 } });

		render(
			<ErrorBoundary>
				<ProblemChild errorToThrow={gridError} />
			</ErrorBoundary>,
		);

		expect(
			screen.getByRole("heading", { name: /pattern generation failed/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/dimensions: 10×20/i)).toBeInTheDocument();
	});

	it("should allow the user to retry after an error", async () => {
		const genericError = new Error("An error");

		// A stateful wrapper to simulate a real-world retry scenario
		function TestHarness() {
			const [isBroken, setIsBroken] = React.useState(true);

			return (
				<div>
					<ErrorBoundary>
						{isBroken ? (
							<ProblemChild errorToThrow={genericError} />
						) : (
							<ProblemChild />
						)}
					</ErrorBoundary>
					<button type="button" onClick={() => setIsBroken(false)}>
						Simulate Fix
					</button>
				</div>
			);
		}

		render(<TestHarness />);

		// Check that the fallback is shown initially
		const retryButton = screen.getByRole("button", { name: /try again/i });
		expect(retryButton).toBeInTheDocument();
		expect(
			screen.queryByText("Children rendered successfully"),
		).not.toBeInTheDocument();

		// Simulate the application logic that would fix the error source.
		// This re-renders the TestHarness with a non-failing child.
		await userEvent.click(screen.getByRole("button", { name: "Simulate Fix" }));

		// Now, click the ErrorBoundary's retry button. This will cause the ErrorBoundary
		// to re-render its children, which are now fixed.
		await userEvent.click(retryButton);

		// Verify that the children are now rendered successfully
		expect(
			await screen.findByText("Children rendered successfully"),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /try again/i }),
		).not.toBeInTheDocument();
	});

	it("should render a custom fallback component if provided", () => {
		const genericError = new Error("An error");
		const CustomFallback = ({
			error,
			retry,
		}: {
			error?: Error;
			retry: () => void;
		}) => (
			<div>
				<h1>Custom Fallback</h1>
				<p>{error?.message}</p>
				<button type="button" onClick={retry}>
					Custom Retry
				</button>
			</div>
		);

		render(
			<ErrorBoundary fallback={CustomFallback}>
				<ProblemChild errorToThrow={genericError} />
			</ErrorBoundary>,
		);

		expect(
			screen.getByRole("heading", { name: /custom fallback/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /custom retry/i }),
		).toBeInTheDocument();
	});

	it("should call the onError callback when an error is caught", () => {
		const onErrorMock = jest.fn();
		const genericError = new Error("An error");

		render(
			<ErrorBoundary onError={onErrorMock}>
				<ProblemChild errorToThrow={genericError} />
			</ErrorBoundary>,
		);

		expect(onErrorMock).toHaveBeenCalledTimes(1);
		expect(onErrorMock).toHaveBeenCalledWith(
			genericError,
			expect.objectContaining({
				componentStack: expect.any(String),
			}),
		);
	});
});
