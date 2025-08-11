import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

describe("Tabs", () => {
	const TestTabs = ({ onValueChange = jest.fn() }) => (
		<Tabs defaultValue="account" onValueChange={onValueChange}>
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
				<TabsTrigger value="disabled" disabled>
					Disabled
				</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<p>Account content</p>
			</TabsContent>
			<TabsContent value="password">
				<p>Password content</p>
			</TabsContent>
			<TabsContent value="disabled">
				<p>Disabled content</p>
			</TabsContent>
		</Tabs>
	);

	it("should render with the default tab active", () => {
		render(<TestTabs />);
		expect(screen.getByText("Account content")).toBeVisible();
		expect(screen.queryByText("Password content")).not.toBeInTheDocument();
	});

	it("should switch tabs on click", async () => {
		const onValueChange = jest.fn();
		render(<TestTabs onValueChange={onValueChange} />);

		const passwordTabTrigger = screen.getByRole("tab", { name: "Password" });
		await userEvent.click(passwordTabTrigger);

		expect(onValueChange).toHaveBeenCalledWith("password");
		expect(screen.getByText("Password content")).toBeVisible();
		expect(screen.queryByText("Account content")).not.toBeInTheDocument();
	});

	it("should not switch to a disabled tab", async () => {
		const onValueChange = jest.fn();
		render(<TestTabs onValueChange={onValueChange} />);

		const disabledTabTrigger = screen.getByRole("tab", { name: "Disabled" });
		expect(disabledTabTrigger).toBeDisabled();

		await userEvent.click(disabledTabTrigger);

		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.getByText("Account content")).toBeVisible();
		expect(screen.queryByText("Disabled content")).not.toBeInTheDocument();
	});
});
