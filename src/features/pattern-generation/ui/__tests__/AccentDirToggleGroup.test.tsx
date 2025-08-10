import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccentDirToggleGroup from "../AccentDirToggleGroup";

describe("AccentDirToggleGroup", () => {
	it("calls onValueChange when a different direction selected", async () => {
		const handle = jest.fn();
		render(<AccentDirToggleGroup value="none" onValueChange={handle} />);
		const target = screen.getByRole("radio", { name: /Toggle slash/i });
		fireEvent.click(target);
		await waitFor(() => expect(handle).toHaveBeenCalledWith("diagonal-slash"));
	});
});
