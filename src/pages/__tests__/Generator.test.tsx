import { render, screen, waitFor } from "@testing-library/react";
import Generator from "@/pages/Generator";

// Mock hook returned values (will be reassigned per test)
const generateFromParams = jest.fn();
const generateFromCode = jest.fn();

jest.mock("@/features/pattern-generation/lib/usePatternGenerator", () => ({
	usePatternGenerator: () => ({
		patternData: { mock: true },
		code: "ENCODED",
		validationError: undefined,
		generateFromParams,
		generateFromCode,
	}),
}));

// Mock child UI to keep test light
jest.mock("@/features/pattern-display/ui/Pattern", () => ({
	Pattern: () => <div data-testid="pattern">PATTERN</div>,
}));
jest.mock("@/widgets/AuthorCredits", () => ({
	AuthorCredits: () => <div data-testid="credits">CREDITS</div>,
}));
jest.mock("@/shared/ui/LinkToHomePage", () => ({
	__esModule: true,
	default: () => <div data-testid="link-home">HOME LINK</div>,
}));
jest.mock("@/features/pattern-generation", () => ({
	GenerationForm: (props: Record<string, unknown>) => (
		<div data-testid="generation-form" data-has-initial={!!props.initialCode} />
	),
}));
jest.mock("@/shared/ui/branding", () => ({
	CircuitLogo: (p: { className?: string }) => (
		<div data-testid="logo" data-class={p.className} />
	),
}));
jest.mock("@/features/pattern-export", () => ({
	CopyCodeButton: (p: { code: string }) => (
		<button type="button" data-testid="copy-code">
			{p.code}
		</button>
	),
	CopyLinkButton: (p: { code: string }) => (
		<button type="button" data-testid="copy-link">
			{p.code}
		</button>
	),
	DownloadSVGButton: () => <button type="button" data-testid="dl-svg" />,
}));

describe("Generator page", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// NEW: no initial code => should NOT call generateFromCode
	it("does not call generateFromCode on mount when no code prop", () => {
		render(<Generator />);
		expect(generateFromCode).not.toHaveBeenCalled();
	});

	// NEW (optional): calling with later code change
	it("calls generateFromCode when code prop appears after mount", async () => {
		const { rerender } = render(<Generator />);
		expect(generateFromCode).not.toHaveBeenCalled();

		rerender(<Generator code="LATECODE" />);
		await waitFor(() =>
			expect(generateFromCode).toHaveBeenCalledWith("LATECODE"),
		);
	});

	it("renders pattern tools and calls generateFromCode when code prop provided", async () => {
		render(<Generator code="ABC123" />);

		// Pattern + tool buttons
		expect(await screen.findByTestId("pattern")).toBeInTheDocument();
		expect(screen.getByTestId("copy-code")).toHaveTextContent("ENCODED");
		expect(screen.getByTestId("copy-link")).toHaveTextContent("ENCODED");
		expect(screen.getByTestId("dl-svg")).toBeInTheDocument();
		expect(screen.getByTestId("generation-form")).toHaveAttribute(
			"data-has-initial",
			"true",
		);
		expect(screen.getByTestId("credits")).toBeInTheDocument();
		expect(screen.getByTestId("logo")).toBeInTheDocument();

		// Effect should trigger generateFromCode with incoming prop
		await waitFor(() =>
			expect(generateFromCode).toHaveBeenCalledWith("ABC123"),
		);
	});

	it("shows validation error instead of pattern when validationError present", async () => {
		// Override mock just for this test
		(
			jest.requireMock(
				"@/features/pattern-generation/lib/usePatternGenerator",
			) as {
				usePatternGenerator: () => {
					patternData: unknown;
					code: string;
					validationError: string | undefined;
					generateFromParams: typeof generateFromParams;
					generateFromCode: typeof generateFromCode;
				};
			}
		).usePatternGenerator = () => ({
			patternData: null,
			code: "",
			validationError: "Bad code",
			generateFromParams,
			generateFromCode,
		});

		// Need to re-import component after altering mock implementation
		let FreshGenerator: typeof Generator | undefined;
		await import("@/pages/Generator").then((mod) => {
			FreshGenerator = mod.default as typeof Generator;
		});

		if (FreshGenerator) {
			render(<FreshGenerator code="BAD" />);
		}

		expect(screen.getByText("Bad code")).toBeInTheDocument();
		expect(screen.queryByTestId("pattern")).not.toBeInTheDocument();
	});
});
