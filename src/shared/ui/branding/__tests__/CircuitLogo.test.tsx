import { render, screen } from "@testing-library/react";
import { CircuitLogo } from "../CircuitLogo";
import { getBaseUrl } from "@/shared/config/env";

// Mock the getBaseUrl function to return a consistent value for tests
jest.mock("@/shared/config/env", () => ({
	getBaseUrl: jest.fn(() => "/"),
}));

describe("CircuitLogo", () => {
	beforeEach(() => {
		// Clear mock history before each test
		(getBaseUrl as jest.Mock).mockClear();
	});

	it("should render the logo with the correct src and alt text", () => {
		render(<CircuitLogo />);

		const logoImage = screen.getByAltText("Circuit Logo");
		expect(logoImage).toBeInTheDocument();
		expect(logoImage).toHaveAttribute("src", "/circuit-large.svg");
		expect(getBaseUrl).toHaveBeenCalledTimes(1);
	});

	it("should apply a custom className to the container", () => {
		const customClass = "my-custom-class";
		render(<CircuitLogo className={customClass} />);

		const logoImage = screen.getByAltText("Circuit Logo");
		const container = logoImage.parentElement;

		expect(container).toHaveClass(customClass);
	});

	it("should render without a custom className if none is provided", () => {
		render(<CircuitLogo />);

		const logoImage = screen.getByAltText("Circuit Logo");
		const container = logoImage.parentElement;

		// The component applies default classes
		expect(container).toHaveClass("fixed", "z-50");
		// Ensure it doesn't have any unexpected empty class attributes
		expect(container?.getAttribute("class")?.trim()).not.toBe("");
	});
});
