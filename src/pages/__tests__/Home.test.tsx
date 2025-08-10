import { render, screen, waitFor } from "@testing-library/react";
import {
	createMemoryHistory,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "@/app/routes";
import { act } from "react";

// Mock the components that might cause issues
jest.mock("@/features/pattern-display", () => ({
	Carousel: () => <div data-testid="carousel">Carousel</div>,
}));

jest.mock("@/shared/ui/branding", () => ({
	CircuitLogo: () => <div data-testid="circuit-logo">Circuit Logo</div>,
}));

jest.mock("@/widgets/AuthorCredits", () => ({
	AuthorCredits: () => <div data-testid="author-credits">Author Credits</div>,
}));

jest.mock("@/widgets/HeroSection", () => ({
	HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
}));

describe("Home Page", () => {
	it("renders without crashing", async () => {
		const memoryHistory = createMemoryHistory({
			initialEntries: ["/"],
		});

		const router = createRouter({
			routeTree,
			history: memoryHistory,
			// Disable transitions in test environment
			// @ts-expect-error (allow test-only override)
			viewTransition: (cb: () => void) => cb(),
		});

		// Ensure initial routes load before assertions
		await act(async () => {
			// Kick off any initial loading
			await router.load();
		});

		render(<RouterProvider router={router} />);

		// Wait for DOM to settle (covers async match updates)
		await waitFor(() =>
			expect(screen.getByText("Make your own!")).toBeInTheDocument(),
		);
	});
});
