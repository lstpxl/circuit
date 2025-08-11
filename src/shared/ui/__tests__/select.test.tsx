import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "../select";

describe("Select", () => {
	const TestSelect = ({ onValueChange = jest.fn() }) => (
		<Select onValueChange={onValueChange}>
			<SelectTrigger>
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Fruits</SelectLabel>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="blueberry">Blueberry</SelectItem>
					<SelectItem value="grapes" disabled>
						Grapes
					</SelectItem>
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Vegetables</SelectLabel>
					<SelectItem value="broccoli">Broccoli</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);

	it("should open and close the select menu", async () => {
		render(<TestSelect />);
		const trigger = screen.getByRole("combobox");

		// Check initial state (closed)
		expect(screen.queryByText("Apple")).not.toBeInTheDocument();

		// Open menu
		await userEvent.click(trigger);
		expect(await screen.findByText("Apple")).toBeVisible();
		expect(screen.getByText("Fruits")).toBeVisible();
		expect(screen.getByText("Vegetables")).toBeVisible();

		// Close menu by pressing escape
		await userEvent.keyboard("{escape}");
		expect(screen.queryByText("Apple")).not.toBeInTheDocument();
	});

	it("should select an item and update the value", async () => {
		const onValueChange = jest.fn();
		render(<TestSelect onValueChange={onValueChange} />);
		const trigger = screen.getByRole("combobox");

		expect(trigger).toHaveTextContent("Select a fruit");

		await userEvent.click(trigger);
		const bananaOption = await screen.findByText("Banana");
		await userEvent.click(bananaOption);

		expect(onValueChange).toHaveBeenCalledWith("banana");
		expect(trigger).toHaveTextContent("Banana");
		// Check that the menu is closed by asserting another option is gone
		expect(screen.queryByText("Apple")).not.toBeInTheDocument();
	});

	it("should not allow selecting a disabled item", async () => {
		const onValueChange = jest.fn();
		render(<TestSelect onValueChange={onValueChange} />);
		const trigger = screen.getByRole("combobox");

		await userEvent.click(trigger);
		const grapesOption = await screen.findByRole("option", { name: "Grapes" });
		expect(grapesOption).toHaveAttribute("aria-disabled", "true");

		await userEvent.click(grapesOption);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(trigger).toHaveTextContent("Select a fruit");
	});

	it("should be disabled", async () => {
		render(
			<Select disabled>
				<SelectTrigger>
					<SelectValue placeholder="Select a fruit" />
				</SelectTrigger>
			</Select>,
		);
		const trigger = screen.getByRole("combobox");
		expect(trigger).toBeDisabled();
		await userEvent.click(trigger);
		expect(screen.queryByText("Select a fruit")).toBeInTheDocument();
	});
});
