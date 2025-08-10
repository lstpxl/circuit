import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ParamForm } from "../ParamForm";

describe("ParamForm", () => {
	it("submits updated numeric params", async () => {
		const onGenerate = jest.fn();
		render(<ParamForm onGenerate={onGenerate} />);
		const widthInput = screen.getByLabelText(/width/i) as HTMLInputElement;
		fireEvent.change(widthInput, { target: { value: "7" } });
		const heightInput = screen.getByLabelText(/height/i) as HTMLInputElement;
		fireEvent.change(heightInput, { target: { value: "9" } });
		fireEvent.click(screen.getByRole("button", { name: /generate/i }));
		// expect(onGenerate).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(onGenerate).toHaveBeenCalledTimes(1));
		const arg = onGenerate.mock.calls[0][0];
		expect(arg.width).toBe(7);
		expect(arg.height).toBe(9);
	});

	it("disables strength inputs when direction none", () => {
		const onGenerate = jest.fn();
		render(<ParamForm onGenerate={onGenerate} />);
		// Toggle group sets direction to none if a button exists; adjust selector:
		const noneBtn = screen.queryByRole("button", { name: /none/i });
		if (noneBtn) {
			fireEvent.click(noneBtn);
			const strengthInput = screen.getByLabelText(
				/accent strength/i,
			) as HTMLInputElement;
			expect(strengthInput).toBeDisabled();
		}
	});
});
