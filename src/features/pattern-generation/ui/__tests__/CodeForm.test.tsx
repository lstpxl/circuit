import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CodeForm } from "../CodeForm";
import { validateCode } from "@/features/pattern-export/lib/codeValidator";

jest.mock("@/features/pattern-export/lib/codeValidator", () => ({
	validateCode: jest.fn(),
}));

const validateCodeMock = validateCode as jest.Mock;

describe("CodeForm", () => {
	beforeEach(() => {
		validateCodeMock.mockReset();
	});

	it("starts with disabled button when validateCode returns false", () => {
		// Return false for any input (initial empty too)
		validateCodeMock.mockReturnValue(false);
		const onGenerate = jest.fn();
		render(<CodeForm onGenerate={onGenerate} />);

		const btn = screen.getByRole("button", { name: /generate/i });
		expect(btn).toBeDisabled();
		// Try clicking anyway
		fireEvent.click(btn);
		expect(onGenerate).not.toHaveBeenCalled();
	});

	it("enables button for valid code and submits", async () => {
		// Valid when non-empty
		validateCodeMock.mockImplementation((code: string) => code.length > 0);

		const onGenerate = jest.fn();
		render(<CodeForm onGenerate={onGenerate} />);

		const input = screen.getByRole("textbox");
		const btn = screen.getByRole("button", { name: /generate/i });

		// Initially empty -> disabled
		expect(btn).toBeDisabled();

		fireEvent.change(input, { target: { value: "VALIDCODE123" } });

		// Revalidation: enabled
		expect(validateCodeMock).toHaveBeenLastCalledWith("VALIDCODE123");
		expect(btn).not.toBeDisabled();

		// Prefer submitting the form to mimic user hitting Enter
		const form = input.closest("form");
		if (form) {
			fireEvent.submit(form);
		}

		await waitFor(() => expect(onGenerate).toHaveBeenCalledTimes(1));
		expect(onGenerate).toHaveBeenCalledWith("VALIDCODE123");
	});

	it("does not submit when validateCode flips back to false", async () => {
		// Valid unless value === BAD
		validateCodeMock.mockImplementation((code: string) => code !== "BAD");

		const onGenerate = jest.fn();
		render(<CodeForm onGenerate={onGenerate} />);

		const input = screen.getByRole("textbox");
		const btn = screen.getByRole("button", { name: /generate/i });

		fireEvent.change(input, { target: { value: "BAD" } });
		expect(btn).toBeDisabled();

		const form = input.closest("form");
		if (form) {
			fireEvent.submit(form);
		}
		await new Promise((r) => setTimeout(r, 50));
		expect(onGenerate).not.toHaveBeenCalled();
	});
});
