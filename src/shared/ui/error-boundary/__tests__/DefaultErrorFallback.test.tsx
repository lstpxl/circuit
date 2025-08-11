import { render, screen } from "@testing-library/react";
import DefaultErrorFallback from "../DefaultErrorFallback";
import userEvent from "@testing-library/user-event";

describe("DefaultErrorFallback", () => {
	it("should render the fallback UI without an error message", () => {
		const retryMock = jest.fn();
		render(<DefaultErrorFallback retry={retryMock} />);

		expect(
			screen.getByRole("heading", { name: /something went wrong/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /try again/i }),
		).toBeInTheDocument();
		expect(screen.queryByRole("log")).not.toBeInTheDocument(); // <pre> has an implicit role of 'log'
	});

	it("should display the error message when an error is provided", () => {
		const retryMock = jest.fn();
		const testError = new Error("Test error message");
		render(<DefaultErrorFallback error={testError} retry={retryMock} />);

		expect(screen.getByText("Test error message")).toBeInTheDocument();
		// Check that the message is inside a <pre> tag
		expect(screen.getByText("Test error message").tagName).toBe("PRE");
	});

	it("should call the retry function when the 'Try Again' button is clicked", async () => {
		const retryMock = jest.fn();
		render(<DefaultErrorFallback retry={retryMock} />);

		const retryButton = screen.getByRole("button", { name: /try again/i });
		await userEvent.click(retryButton);

		expect(retryMock).toHaveBeenCalledTimes(1);
	});
});
