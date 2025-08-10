import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
	within,
} from "@testing-library/react";
import { CopyLinkButton } from "../CopyLinkButton";
import { useClipboard } from "../../lib/useClipboard";
import { getBaseUrl } from "@/shared/config/env";

// Mock the useClipboard hook
jest.mock("../../lib/useClipboard", () => ({
	useClipboard: jest.fn(),
}));

// Mock SmallIconButton to avoid complex component interactions
jest.mock("@/shared/ui/SmallIconButton", () => {
	type SmallIconButtonProps = {
		onClick: React.MouseEventHandler<HTMLButtonElement>;
		titleIdle: string;
		titleTriggered: string;
		icon: React.ReactNode;
	};
	return function SmallIconButton({
		onClick,
		titleIdle,
		titleTriggered,
		icon,
	}: SmallIconButtonProps) {
		return (
			<button
				type="button"
				onClick={onClick}
				title={titleIdle}
				data-title-alt={titleTriggered}
				data-testid="copy-button"
				aria-label="Copy pattern code"
			>
				{icon}
			</button>
		);
	};
});

const mockUseClipboard = useClipboard as jest.Mock;

const makeUrl = (code: string) => {
	const currentUrl = new URL(window.location.href);
	const baseUrl = getBaseUrl();
	const generatePath = baseUrl.endsWith("/")
		? `${baseUrl}generate`
		: `${baseUrl}/generate`;
	const shareableUrl = `${currentUrl.protocol}//${currentUrl.host}${generatePath}?code=${code}`;
	return shareableUrl;
};

describe("CopyLinkButton", () => {
	const mockCode = "3x3xABC123def";
	const mockCopy = jest.fn();

	beforeEach(() => {
		mockCopy.mockClear();
		mockCopy.mockResolvedValue(true);
		mockUseClipboard.mockReturnValue({
			copy: mockCopy,
		});
	});

	it("should render with copy icon and default title", () => {
		render(<CopyLinkButton code={mockCode} />);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("title", "Copy link");
	});

	it("should Copy link to clipboard when clicked", async () => {
		render(<CopyLinkButton code={mockCode} />);

		const button = screen.getByRole("button");

		await act(async () => {
			fireEvent.click(button);
		});

		const mockUrl = makeUrl(mockCode);
		expect(mockCopy).toHaveBeenCalledWith(mockUrl);
	});

	it("should handle clipboard write failure gracefully", async () => {
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
		mockCopy.mockRejectedValue(new Error("Clipboard not available"));

		render(<CopyLinkButton code={mockCode} />);

		const button = screen.getByRole("button");

		await act(async () => {
			fireEvent.click(button);
		});

		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Failed to copy link:",
				expect.any(Error),
			);
		});

		consoleErrorSpy.mockRestore();
	});

	it("should handle empty code", async () => {
		render(<CopyLinkButton code="" />);

		const button = screen.getByRole("button");

		await act(async () => {
			fireEvent.click(button);
		});

		const mockUrl = makeUrl("");
		expect(mockCopy).toHaveBeenCalledWith(mockUrl);
	});

	it("should handle very long code strings", async () => {
		const longCode = "x".repeat(10000);
		render(<CopyLinkButton code={longCode} />);

		const button = screen.getByRole("button");

		await act(async () => {
			fireEvent.click(button);
		});

		const mockUrl = makeUrl(longCode);
		expect(mockCopy).toHaveBeenCalledWith(mockUrl);
	});

	it("should handle multiple rapid clicks", async () => {
		render(<CopyLinkButton code={mockCode} />);

		const button = screen.getByRole("button");

		await act(async () => {
			fireEvent.click(button);
			fireEvent.click(button);
			fireEvent.click(button);
		});

		const mockUrl = makeUrl(mockCode);
		expect(mockCopy).toHaveBeenCalledTimes(3);
		expect(mockCopy).toHaveBeenCalledWith(mockUrl);
	});

	it("should display correct SVG icon", async () => {
		render(<CopyLinkButton code={mockCode} />);

		const button = await screen.findByTestId("copy-button");
		expect(button).toBeInTheDocument();

		// const svg = button.closest("svg");
		const svgTitle = within(button).getByTitle("Copy link");
		const svg = svgTitle.closest("svg");
		expect(svg).toHaveAttribute("width", "16");
		expect(svg).toHaveAttribute("height", "16");
		expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
	});

	it("should have accessible title attribute", async () => {
		render(<CopyLinkButton code={mockCode} />);

		const button = await screen.findByTestId("copy-button");
		expect(button).toBeInTheDocument();
		const svgTitle = within(button).getByTitle("Copy link");
		expect(svgTitle).toBeInTheDocument();
	});

	it("should call useClipboard hook", () => {
		render(<CopyLinkButton code={mockCode} />);

		expect(mockUseClipboard).toHaveBeenCalled();
	});

	it("should preserve button functionality after failed copy", async () => {
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
		mockCopy
			.mockRejectedValueOnce(new Error("First failure"))
			.mockResolvedValue(true);

		render(<CopyLinkButton code={mockCode} />);
		const button = screen.getByRole("button");

		// First click fails
		await act(async () => {
			fireEvent.click(button);
		});

		// Second click should still work
		await act(async () => {
			fireEvent.click(button);
		});

		expect(mockCopy).toHaveBeenCalledTimes(2);
		consoleErrorSpy.mockRestore();
	});
});
