import { render, screen } from "@testing-library/react";
import { GithubLogo } from "../GithubLogo";

describe("GithubLogo", () => {
	it("should render the GitHub logo SVG", () => {
		render(<GithubLogo />);

		const logoTitle = screen.getByTitle("GitHub logo");
		expect(logoTitle).toBeInTheDocument();

		// Check that the parent of the title is the SVG element
		const svgElement = logoTitle.parentElement;
		expect(svgElement?.tagName).toBe("svg");
	});
});
