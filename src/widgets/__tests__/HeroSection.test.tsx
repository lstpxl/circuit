import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
	it("should render the main heading text", () => {
		render(<HeroSection />);
		const headingElement = screen.getByText(/your abstract art machine/i);
		expect(headingElement).toBeInTheDocument();
	});

	it("should render the text within a div element", () => {
		render(<HeroSection />);
		const headingElement = screen.getByText(/your abstract art machine/i);
		expect(headingElement.tagName).toBe("DIV");
	});
});
