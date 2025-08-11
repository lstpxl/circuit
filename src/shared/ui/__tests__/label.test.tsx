import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Label } from "../label";

describe("Label", () => {
	it("should focus the associated input on click via htmlFor", async () => {
		render(
			<>
				<Label htmlFor="test-input">Test Label</Label>
				<input id="test-input" type="text" />
			</>,
		);

		const label = screen.getByText("Test Label");
		const input = screen.getByRole("textbox");

		expect(input).not.toHaveFocus();
		await userEvent.click(label);
		expect(input).toHaveFocus();
	});

	it("should focus the wrapped input on click", async () => {
		render(
			<Label>
				Test Label
				<input type="text" />
			</Label>,
		);

		const label = screen.getByText("Test Label");
		const input = screen.getByRole("textbox");

		expect(input).not.toHaveFocus();
		await userEvent.click(label);
		expect(input).toHaveFocus();
	});

	it("should render with a custom className", () => {
		render(<Label className="custom-label">Test Label</Label>);
		expect(screen.getByText("Test Label")).toHaveClass("custom-label");
	});

	it("should have disabled styles when associated input is disabled", () => {
		render(
			<>
				<Label htmlFor="test-input">Test Label</Label>
				<input id="test-input" type="text" disabled />
			</>,
		);
		const label = screen.getByText("Test Label");
		// These classes are applied by Tailwind's peer-disabled variant
		expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
		expect(label).toHaveClass("peer-disabled:opacity-50");
	});

	it("should not focus the input when the label is clicked and input is disabled", async () => {
		render(
			<>
				<Label htmlFor="test-input">Test Label</Label>
				<input id="test-input" type="text" disabled />
			</>,
		);

		const label = screen.getByText("Test Label");
		const input = screen.getByRole("textbox");

		expect(input).toBeDisabled();
		await userEvent.click(label);
		expect(input).not.toHaveFocus();
	});
});
