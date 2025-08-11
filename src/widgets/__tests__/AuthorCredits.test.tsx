import { render, screen } from "@testing-library/react";
import { AuthorCredits } from "../AuthorCredits";
import { APP_CONFIG } from "@/shared/config/constants";

// filepath: src/widgets/AuthorCredits.test.tsx

// Mock the dependencies
jest.mock("@/shared/config/constants", () => ({
	APP_CONFIG: {
		repository: "https://github.com/test/repo",
	},
}));

jest.mock("../../shared/ui/branding/GithubLogo", () => ({
	GithubLogo: () => <span data-testid="github-logo" />,
}));

describe("AuthorCredits", () => {
	it("should render the copyright text", () => {
		render(<AuthorCredits />);
		expect(screen.getByText(/© 2025 Ilia Pavlov/i)).toBeInTheDocument();
	});

	it("should render the GitHub repository link", () => {
		render(<AuthorCredits />);
		const linkElement = screen.getByRole("link", {
			name: /github repository/i,
		});
		expect(linkElement).toBeInTheDocument();
	});

	it("should have the correct href for the repository link", () => {
		render(<AuthorCredits />);
		const linkElement = screen.getByRole("link", {
			name: /github repository/i,
		});
		expect(linkElement).toHaveAttribute("href", APP_CONFIG.repository);
	});

	it("should render the GithubLogo component", () => {
		render(<AuthorCredits />);
		expect(screen.getByTestId("github-logo")).toBeInTheDocument();
	});
});
