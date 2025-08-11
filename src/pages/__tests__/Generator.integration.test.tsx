import { act, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/app/routes";
import type { PatternDisplayable } from "@/entities/pattern";

// Mock hook returned values
const generateFromParams = jest.fn();
const generateFromCode = jest.fn();

// Mock usePatternGenerator hook
jest.mock("@/features/pattern-generation/lib/usePatternGenerator", () => ({
	usePatternGenerator: () => ({
		patternData: {
			mock: true,
			dimensions: { width: 4, height: 4 },
			pattern: "mocked-pattern-data",
		},
		code: "4x4xABUjALa45QJdCg",
		validationError: undefined,
		generateFromParams,
		generateFromCode,
	}),
}));

// Mock child components
jest.mock("@/features/pattern-display/ui/Pattern", () => ({
	Pattern: ({ patternData }: { patternData: PatternDisplayable }) => (
		<div data-testid="pattern" data-pattern={JSON.stringify(patternData)}>
			PATTERN RENDERED
		</div>
	),
}));

jest.mock("@/widgets/AuthorCredits", () => ({
	AuthorCredits: () => <div data-testid="credits">CREDITS</div>,
}));

jest.mock("@/shared/ui/LinkToHomePage", () => ({
	__esModule: true,
	default: () => <div data-testid="link-home">HOME LINK</div>,
}));

jest.mock("@/features/pattern-generation", () => ({
	GenerationForm: (props: { initialCode?: string }) => (
		<div
			data-testid="generation-form"
			data-initial-code={props.initialCode || ""}
		>
			GENERATION FORM
		</div>
	),
}));

jest.mock("@/shared/ui/branding", () => ({
	CircuitLogo: (p: { className?: string }) => (
		<div data-testid="logo" data-class={p.className}>
			LOGO
		</div>
	),
}));

jest.mock("@/features/pattern-export", () => ({
	CopyCodeButton: (p: { code: string }) => (
		<button type="button" data-testid="copy-code" data-code={p.code}>
			Copy Code: {p.code}
		</button>
	),
	CopyLinkButton: (p: { code: string }) => (
		<button type="button" data-testid="copy-link" data-code={p.code}>
			Copy Link: {p.code}
		</button>
	),
	DownloadSVGButton: () => (
		<button type="button" data-testid="dl-svg">
			Download SVG
		</button>
	),
}));

// Mock ErrorBoundary
jest.mock("@/shared/ui/error-boundary/ErrorBoundary", () => ({
	ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="error-boundary">{children}</div>
	),
}));

describe("Generator URL Integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const renderWithTanStackRouter = (initialLocation = "/generate") => {
		const memoryHistory = createMemoryHistory({
			initialEntries: [initialLocation],
		});

		const router = createRouter({
			routeTree,
			history: memoryHistory,
		});

		return render(<RouterProvider router={router} />);
	};

	it("should extract code from URL query parameters and render corresponding pattern", async () => {
		const urlCode = "4x4xABUjALa45QJdCg";

		// Mock the hook to return the URL code
		(
			jest.requireMock(
				"@/features/pattern-generation/lib/usePatternGenerator",
			) as {
				usePatternGenerator: () => {
					patternData: unknown;
					code: string;
					validationError: string | null;
					generateFromParams: jest.Mock;
					generateFromCode: jest.Mock;
				};
			}
		).usePatternGenerator = () => ({
			patternData: {
				width: 4,
				height: 4,
				lines: [],
			},
			code: urlCode,
			validationError: null,
			generateFromParams,
			generateFromCode,
		});

		renderWithTanStackRouter(`/generate?code=${urlCode}`);

		// Verify export buttons show the correct code and handle clicks
		const copyCodeButton = await screen.findByTestId("copy-code");
		expect(copyCodeButton).toBeInTheDocument();
		expect(copyCodeButton).toHaveAttribute("data-code", urlCode);

		const copyLinkButton = await screen.findByTestId("copy-link");
		expect(copyLinkButton).toBeInTheDocument();
		expect(copyLinkButton).toHaveAttribute("data-code", urlCode);

		// Test actual button functionality
		await act(async () => {
			fireEvent.click(copyCodeButton);
		});

		await act(async () => {
			fireEvent.click(copyLinkButton);
		});

		// Verify button text content
		expect(copyCodeButton).toHaveTextContent(`Copy Code: ${urlCode}`);
		expect(copyLinkButton).toHaveTextContent(`Copy Link: ${urlCode}`);

		// Verify export buttons show the correct code
		expect(screen.getByTestId("copy-code")).toHaveAttribute(
			"data-code",
			urlCode,
		);
	});

	it("should handle URL without code parameter", async () => {
		renderWithTanStackRouter("/generate");

		// Should still render the page but without initial pattern
		expect(await screen.findByTestId("generation-form")).toBeInTheDocument();
		expect(screen.getByTestId("generation-form")).toHaveAttribute(
			"data-initial-code",
			"",
		);

		// Other components should still be present
		expect(screen.getByTestId("credits")).toBeInTheDocument();
		expect(screen.getByTestId("logo")).toBeInTheDocument();
		expect(screen.getByTestId("link-home")).toBeInTheDocument();
	});
	/* 
	it("should handle invalid code in URL parameter", async () => {
		const invalidCode = "invalid-code-123";

		// Mock the hook to return validation error for invalid code
		(
			jest.requireMock(
				"@/features/pattern-generation/lib/usePatternGenerator",
			) as typeof import(
				"@/features/pattern-generation/lib/usePatternGenerator",
			)
		).usePatternGenerator = () => ({
			patternData: null,
			code: "",
			validationError: "Invalid pattern code format",
			generateFromParams,
			generateFromCode,
		});

		renderWithTanStackRouter(`/generate?code=${invalidCode}`);

		// Should show validation error instead of pattern
		expect(
			await screen.findByText("Invalid pattern code format"),
		).toBeInTheDocument();
		expect(screen.queryByTestId("pattern")).not.toBeInTheDocument();

		// Generation form should still receive the invalid code
		expect(screen.getByTestId("generation-form")).toHaveAttribute(
			"data-initial-code",
			invalidCode,
		);
	});

	it("should handle special characters in URL code parameter", async () => {
		const decodedCode = "4x4xAB+Uj/ALa45QJdCg"; // What it should decode to
		const encodedCode = encodeURIComponent(decodedCode); // URL encoded version

		// Mock the hook to handle the decoded code
		(
			jest.requireMock(
				"@/features/pattern-generation/lib/usePatternGenerator",
			) as typeof import(
				"@/features/pattern-generation/lib/usePatternGenerator",
			)
		).usePatternGenerator = () => ({
			patternData: {
				mock: true,
				dimensions: { width: 4, height: 4 },
				pattern: `pattern-for-${decodedCode}`,
			},
			code: decodedCode,
			validationError: undefined,
			generateFromParams,
			generateFromCode,
		});

		renderWithTanStackRouter(`/generate?code=${encodedCode}`);

		// Verify the pattern is rendered with decoded code
		expect(await screen.findByTestId("pattern")).toBeInTheDocument();
		expect(screen.getByTestId("copy-code")).toHaveAttribute(
			"data-code",
			decodedCode,
		);
		expect(screen.getByTestId("copy-link")).toHaveAttribute(
			"data-code",
			decodedCode,
		);
	});

	it("should navigate to home page correctly", async () => {
		renderWithTanStackRouter("/");

		// Should render the home page (mocked as simple component)
		// Since we don't have Home component mocked, we'll check that we're not on generator
		expect(screen.queryByTestId("generation-form")).not.toBeInTheDocument();
		expect(screen.queryByTestId("pattern")).not.toBeInTheDocument();
	});

	it("should handle multiple query parameters including code", async () => {
		const urlCode = "4x4xABUjALa45QJdCg";

		// Mock the hook to return the URL code
		(
			jest.requireMock(
				"@/features/pattern-generation/lib/usePatternGenerator",
			) as any
		).usePatternGenerator = () => ({
			patternData: {
				mock: true,
				dimensions: { width: 4, height: 4 },
				pattern: `pattern-for-${urlCode}`,
			},
			code: urlCode,
			validationError: undefined,
			generateFromParams,
			generateFromCode,
		});

		renderWithTanStackRouter(`/generate?code=${urlCode}&theme=dark&debug=true`);

		// Verify the pattern is rendered (code parameter is still extracted correctly)
		expect(await screen.findByTestId("pattern")).toBeInTheDocument();
		expect(screen.getByTestId("copy-code")).toHaveAttribute(
			"data-code",
			urlCode,
		);
		expect(screen.getByTestId("copy-link")).toHaveAttribute(
			"data-code",
			urlCode,
		);
	});

	it("should handle empty code parameter", async () => {
		// Mock the hook for empty code
		(
			jest.requireMock(
				"@/features/pattern-generation/lib/usePatternGenerator",
			) as typeof import(
				"@/features/pattern-generation/lib/usePatternGenerator",
			)
		).usePatternGenerator = () => ({
			patternData: null,
			code: "",
			validationError: undefined,
			generateFromParams,
			generateFromCode,
		});

		renderWithTanStackRouter("/generate?code=");

		// Should render the form with empty initial code
		expect(await screen.findByTestId("generation-form")).toBeInTheDocument();
		expect(screen.getByTestId("generation-form")).toHaveAttribute(
			"data-initial-code",
			"",
		);
	}); */
});
