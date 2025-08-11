import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "../toggle";

describe("Toggle", () => {
	it("should render a toggle button", () => {
		render(<Toggle aria-label="Toggle italic" />);
		const toggleButton = screen.getByRole("button", { name: "Toggle italic" });
		expect(toggleButton).toBeInTheDocument();
		expect(toggleButton).toHaveAttribute("data-state", "off");
	});

	it("should toggle state on click", async () => {
		const onPressedChange = jest.fn();
		render(
			<Toggle aria-label="Toggle italic" onPressedChange={onPressedChange} />,
		);
		const toggleButton = screen.getByRole("button", { name: "Toggle italic" });

		await userEvent.click(toggleButton);
		expect(toggleButton).toHaveAttribute("data-state", "on");
		expect(onPressedChange).toHaveBeenCalledWith(true);

		await userEvent.click(toggleButton);
		expect(toggleButton).toHaveAttribute("data-state", "off");
		expect(onPressedChange).toHaveBeenCalledWith(false);
	});

	it("should be disabled", async () => {
		const onPressedChange = jest.fn();
		render(
			<Toggle
				aria-label="Toggle italic"
				disabled
				onPressedChange={onPressedChange}
			/>,
		);
		const toggleButton = screen.getByRole("button", { name: "Toggle italic" });

		expect(toggleButton).toBeDisabled();
		await userEvent.click(toggleButton);
		expect(onPressedChange).not.toHaveBeenCalled();
	});

	it("should render with defaultPressed state", () => {
		render(<Toggle aria-label="Toggle italic" defaultPressed />);
		const toggleButton = screen.getByRole("button", { name: "Toggle italic" });
		expect(toggleButton).toHaveAttribute("data-state", "on");
	});

	it("should respect the pressed prop for controlled component behavior", async () => {
		const { rerender } = render(<Toggle aria-label="Toggle italic" pressed />);
		const toggleButton = screen.getByRole("button", { name: "Toggle italic" });
		expect(toggleButton).toHaveAttribute("data-state", "on");

		// Clicking should not change the state if it's controlled
		await userEvent.click(toggleButton);
		expect(toggleButton).toHaveAttribute("data-state", "on");

		rerender(<Toggle aria-label="Toggle italic" pressed={false} />);
		expect(toggleButton).toHaveAttribute("data-state", "off");
	});
});
