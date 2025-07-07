import { useForm, Controller } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { validateCode } from "./codeValidator";

type CodeFormData = {
	code: string;
};

type CodeFormProps = {
	onGenerate: (code: string) => void;
} & React.FormHTMLAttributes<HTMLFormElement>;

export default function CodeGenerationForm(props: CodeFormProps) {
	const { onGenerate, ...formProps } = props;

	const { control, handleSubmit, watch } = useForm<CodeFormData>({
		defaultValues: {
			code: "",
		},
	});

	const code = watch("code");
	const codeIsValid = validateCode(code);

	const onSubmit = (data: CodeFormData) => {
		onGenerate(data.code);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} {...formProps}>
			<Card className="flex flex-col items-center rounded-lg shadow-lg p-6 bg-neutral-500 dark:bg-neutral-800 gap-4 min-w-[468px]">
				<div className="grid grid-cols-1 gap-4 max-w-lg">
					<Label htmlFor="code_input" className="text-left">
						Code
					</Label>
					<Controller
						name="code"
						control={control}
						render={({ field }) => (
							<Textarea
								id="code_input"
								placeholder="Enter your code here..."
								rows={2}
								value={field.value}
								onChange={field.onChange}
								className="w-full resize-none min-w-[400px]"
							/>
						)}
					/>
				</div>

				<Button
					type="submit"
					disabled={!codeIsValid}
					className="mt-2 cursor-pointer text-white hover:border-primary hover:border-2 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Generate
				</Button>
			</Card>
		</form>
	);
}
