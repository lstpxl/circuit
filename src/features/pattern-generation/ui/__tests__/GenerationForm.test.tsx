import {
	render,
	screen,
	fireEvent,
	within,
	waitFor,
} from "@testing-library/react";
import { GenerationForm } from "../GenerationForm";
import { validateCode } from "@/features/pattern-export/lib/codeValidator";

jest.mock("@/features/pattern-export/lib/codeValidator", () => ({
	validateCode: jest.fn(() => true),
}));
const validateCodeMock = validateCode as jest.Mock;

describe("GenerationForm", () => {
	afterEach(() => jest.clearAllMocks());

	it("invokes onCodeGenerate when code form used", async () => {
		const onParam = jest.fn();
		const onCode = jest.fn();

		render(
			<GenerationForm
				onParamGenerate={onParam}
				onCodeGenerate={onCode}
				initialCode={undefined}
			/>,
		);

		// Switch to code tab if tabs exist
		const codeTab = screen.queryByRole("tab", { name: /code/i });
		if (codeTab) fireEvent.click(codeTab);

		const codeForm = screen.getByTestId("code-form");
		const input = within(codeForm).getByRole("textbox");
		fireEvent.change(input, { target: { value: "4x4xEYnayMJbBBJJAQ" } });

		const submitBtn = within(codeForm).getByRole("button", {
			name: /generate/i,
		});
		expect(submitBtn).not.toBeDisabled();
		fireEvent.click(submitBtn);

		// console.log(submitBtn.outerHTML, (input as HTMLInputElement).value);

		await waitFor(() => expect(onCode).toHaveBeenCalledTimes(1));

		expect(validateCodeMock).toHaveBeenLastCalledWith("4x4xEYnayMJbBBJJAQ");
		expect(onCode).toHaveBeenCalledWith("4x4xEYnayMJbBBJJAQ");
	});

	it("invokes onParamGenerate from param form", async () => {
		const onParam = jest.fn();
		const onCode = jest.fn();

		render(
			<GenerationForm
				onParamGenerate={onParam}
				onCodeGenerate={onCode}
				initialCode={undefined}
			/>,
		);

		const paramTab = screen.queryByRole("tab", { name: /parameters|params/i });
		if (paramTab) fireEvent.click(paramTab);

		const paramForm = screen.getByTestId("param-form");
		const widthInput = within(paramForm).getByLabelText(
			/width/i,
		) as HTMLInputElement;
		fireEvent.change(widthInput, { target: { value: "11" } });

		const submitBtn = within(paramForm).getByRole("button", {
			name: /generate/i,
		});
		fireEvent.click(submitBtn);

		await waitFor(() => expect(onParam).toHaveBeenCalledTimes(1));

		expect(onParam.mock.calls[0][0].width).toBe(11);
	});
});
