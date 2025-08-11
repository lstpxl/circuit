import { render, screen } from "@testing-library/react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
	CardFooter,
} from "../card";

describe("Card Components", () => {
	it("should render a Card with all its parts", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
					<CardAction>
						<button type="button">Action</button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
			</Card>,
		);

		expect(screen.getByText("Card Title")).toBeInTheDocument();
		expect(screen.getByText("Card Description")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
		expect(screen.getByText("Card Content")).toBeInTheDocument();
		expect(screen.getByText("Card Footer")).toBeInTheDocument();
	});

	it("should apply custom classNames", () => {
		const { container } = render(
			<Card className="custom-card">
				<CardHeader className="custom-header">
					<CardTitle className="custom-title">Title</CardTitle>
					<CardDescription className="custom-description">
						Description
					</CardDescription>
					<CardAction className="custom-action">Action</CardAction>
				</CardHeader>
				<CardContent className="custom-content">Content</CardContent>
				<CardFooter className="custom-footer">Footer</CardFooter>
			</Card>,
		);

		expect(container.firstChild).toHaveClass("custom-card");
		expect(screen.getByText("Title").parentElement).toHaveClass(
			"custom-header",
		);
		expect(screen.getByText("Title")).toHaveClass("custom-title");
		expect(screen.getByText("Description")).toHaveClass("custom-description");
		expect(screen.getByText("Action")).toHaveClass("custom-action");
		expect(screen.getByText("Content")).toHaveClass("custom-content");
		expect(screen.getByText("Footer")).toHaveClass("custom-footer");
	});
});
