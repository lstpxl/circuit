import { render, screen, fireEvent, act } from "@testing-library/react";
import SmallIconButton from "../SmallIconButton";

// Mock icon component for testing
const MockIcon = () => <span data-testid="mock-icon">📋</span>;

describe("SmallIconButton", () => {
	const mockOnClick = jest.fn();

	beforeEach(() => {
		mockOnClick.mockClear();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("should render button with icon", () => {
		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");
		const icon = screen.getByTestId("mock-icon");

		expect(button).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
	});

	it("should call onClick when clicked", () => {
		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it("should prevent default on click", () => {
		const mockPreventDefault = jest.fn();

		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");

		// Create a proper event with preventDefault
		const clickEvent = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
		});
		clickEvent.preventDefault = mockPreventDefault;

		fireEvent(button, clickEvent);

		expect(mockPreventDefault).toHaveBeenCalled();
	});

	it("should display default title when no custom title provided", () => {
		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("title", "Click me");
	});

	it("should display custom idle title", () => {
		render(
			<SmallIconButton
				onClick={mockOnClick}
				icon={<MockIcon />}
				titleIdle="Custom idle title"
			/>,
		);

		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("title", "Custom idle title");
	});

	it("should display triggered title after click", () => {
		render(
			<SmallIconButton
				onClick={mockOnClick}
				icon={<MockIcon />}
				titleIdle="Copy"
				titleTriggered="Copied!"
			/>,
		);

		const button = screen.getByRole("button");

		// Initially shows idle title
		expect(button).toHaveAttribute("title", "Copy");

		// Click the button
		fireEvent.click(button);

		// Should show triggered title
		expect(button).toHaveAttribute("title", "Copied!");
	});

	it("should revert to idle title after timeout", async () => {
		render(
			<SmallIconButton
				onClick={mockOnClick}
				icon={<MockIcon />}
				titleIdle="Copy"
				titleTriggered="Copied!"
			/>,
		);

		const button = screen.getByRole("button");

		// Click the button
		fireEvent.click(button);
		expect(button).toHaveAttribute("title", "Copied!");

		// Fast-forward time wrapped in act
		await act(async () => {
			jest.advanceTimersByTime(300);
		});

		// Should revert to idle title
		expect(button).toHaveAttribute("title", "Copy");
	});

	it("should use default triggered title when not provided", () => {
		render(
			<SmallIconButton
				onClick={mockOnClick}
				icon={<MockIcon />}
				titleIdle="Custom idle"
			/>,
		);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(button).toHaveAttribute("title", "Triggered!");
	});

	it("should apply triggered scale class when clicked", () => {
		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");

		// Initially has scale-100
		expect(button).toHaveClass("scale-100");
		expect(button).not.toHaveClass("scale-80");

		// Click the button
		fireEvent.click(button);

		// Should have scale-80
		expect(button).toHaveClass("scale-80");
		expect(button).not.toHaveClass("scale-100");
	});

	it("should revert scale class after timeout", async () => {
		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");

		// Click the button
		fireEvent.click(button);
		expect(button).toHaveClass("scale-80");

		// Fast-forward time wrapped in act
		await act(async () => {
			jest.advanceTimersByTime(300);
		});

		// Should revert to scale-100
		expect(button).toHaveClass("scale-100");
		expect(button).not.toHaveClass("scale-80");
	});

	it("should pass through additional props", () => {
		render(
			<SmallIconButton
				onClick={mockOnClick}
				icon={<MockIcon />}
				disabled
				data-testid="custom-button"
				aria-label="Custom label"
			/>,
		);

		const button = screen.getByRole("button");

		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("data-testid", "custom-button");
		expect(button).toHaveAttribute("aria-label", "Custom label");
	});

	it("should have correct default styling classes", () => {
		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");

		expect(button).toHaveClass("bg-black/70");
		expect(button).toHaveClass("hover:bg-black/90");
		expect(button).toHaveClass("text-white");
		expect(button).toHaveClass("p-2");
		expect(button).toHaveClass("rounded-md");
		expect(button).toHaveClass("transition-all");
		expect(button).toHaveClass("cursor-pointer");
		expect(button).toHaveClass("hover:outline-1");
		expect(button).toHaveClass("hover:outline-white/50");
	});

	it('should have type="button" by default', () => {
		render(<SmallIconButton onClick={mockOnClick} icon={<MockIcon />} />);

		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("type", "button");
	});

	it("should handle multiple rapid clicks correctly", () => {
		render(
			<SmallIconButton
				onClick={mockOnClick}
				icon={<MockIcon />}
				titleIdle="Copy"
				titleTriggered="Copied!"
			/>,
		);

		const button = screen.getByRole("button");

		// Click multiple times rapidly
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		expect(mockOnClick).toHaveBeenCalledTimes(3);
		expect(button).toHaveAttribute("title", "Copied!");
		expect(button).toHaveClass("scale-80");
	});
});
