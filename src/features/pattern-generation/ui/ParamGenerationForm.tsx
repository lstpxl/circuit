import { useForm, Controller } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import type { GeneratorParams } from "@/features/pattern-generation/model/GeneratorParams";
import { defaultGeneratorParams } from "@/features/pattern-generation/model/defaultGeneratorParams";
import AccentDirToggleGroup from "./AccentDirToggleGroup";

type GeneratorFormProps = {
	onGenerate: (data: GeneratorParams) => void;
} & React.FormHTMLAttributes<HTMLFormElement>;

export function ParamGenerationForm(props: GeneratorFormProps) {
	const { onGenerate, ...formProps } = props;

	const { control, handleSubmit, watch } = useForm<GeneratorParams>({
		defaultValues: defaultGeneratorParams,
	});

	const direction = watch("direction");
	const isStrengthDisabled = direction === "none";

	const onSubmit = (data: GeneratorParams) => {
		onGenerate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} {...formProps}>
			<Card className="flex flex-col items-center rounded-lg shadow-lg p-6 bg-neutral-500 dark:bg-neutral-800 gap-2">
				{/* Width */}
				<div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center w-full max-w-lg">
					<Label htmlFor="width_input" className="text-left">
						Width
					</Label>
					<Controller
						name="width"
						control={control}
						render={({ field }) => (
							<Slider
								id="width_slider"
								min={1}
								max={25}
								step={1}
								value={[field.value]}
								onValueChange={(value) => field.onChange(value[0])}
								className="w-[200px]"
							/>
						)}
					/>
					<Controller
						name="width"
						control={control}
						render={({ field }) => (
							<Input
								id="width_input"
								type="number"
								min={1}
								max={25}
								value={field.value}
								onChange={(e) => field.onChange(Number(e.target.value))}
								className="w-20 text-center"
							/>
						)}
					/>
				</div>

				{/* Height */}
				<div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center w-full max-w-lg">
					<Label htmlFor="height_input" className="text-left">
						Height
					</Label>
					<Controller
						name="height"
						control={control}
						render={({ field }) => (
							<Slider
								id="height_slider"
								min={1}
								max={25}
								step={1}
								value={[field.value]}
								onValueChange={(value) => field.onChange(value[0])}
								className="w-[200px]"
							/>
						)}
					/>
					<Controller
						name="height"
						control={control}
						render={({ field }) => (
							<Input
								id="height_input"
								type="number"
								min={1}
								max={25}
								value={field.value}
								onChange={(e) => field.onChange(Number(e.target.value))}
								className="w-20 text-center"
							/>
						)}
					/>
				</div>

				{/* Density */}
				<div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center w-full max-w-lg">
					<Label htmlFor="density_input" className="text-left">
						Density
					</Label>
					<Controller
						name="density"
						control={control}
						render={({ field }) => (
							<Slider
								id="density_slider"
								min={0}
								max={100}
								step={1}
								value={[field.value]}
								onValueChange={(value) => field.onChange(value[0])}
								className="w-[200px]"
							/>
						)}
					/>
					<Controller
						name="density"
						control={control}
						render={({ field }) => (
							<Input
								id="density_input"
								type="number"
								min={0}
								max={100}
								value={field.value}
								onChange={(e) => field.onChange(Number(e.target.value))}
								className="w-20 text-center"
							/>
						)}
					/>
				</div>

				{/* Cohesion */}
				<div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center w-full max-w-lg">
					<Label htmlFor="cohesion_input" className="text-left">
						Cohesion
					</Label>
					<Controller
						name="cohesion"
						control={control}
						render={({ field }) => (
							<Slider
								id="cohesion_slider"
								min={-100}
								max={100}
								step={1}
								value={[field.value]}
								onValueChange={(value) => field.onChange(value[0])}
								className="w-[200px]"
							/>
						)}
					/>
					<Controller
						name="cohesion"
						control={control}
						render={({ field }) => (
							<Input
								id="cohesion_input"
								type="number"
								min={-100}
								max={100}
								value={field.value}
								onChange={(e) => field.onChange(Number(e.target.value))}
								className="w-20 text-center"
							/>
						)}
					/>
				</div>

				{/* Direction */}
				<div className="grid grid-cols-[1fr_auto] gap-4 items-center w-full max-w-lg">
					<Label htmlFor="direction_toggle" className="text-left">
						Accent direction
					</Label>
					<Controller
						name="direction"
						control={control}
						render={({ field }) => (
							<AccentDirToggleGroup
								value={field.value}
								onValueChange={field.onChange}
							/>
						)}
					/>
				</div>

				{/* Strength */}
				<div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center w-full max-w-lg">
					<Label
						htmlFor="strength_input"
						className={`text-left ${
							isStrengthDisabled ? "text-muted-foreground" : ""
						}`}
					>
						Accent strength
					</Label>
					<Controller
						name="strength"
						control={control}
						render={({ field }) => (
							<Slider
								id="strength_slider"
								min={0}
								max={100}
								step={1}
								value={[field.value]}
								onValueChange={(value) => field.onChange(value[0])}
								disabled={isStrengthDisabled}
								className="w-[200px]"
							/>
						)}
					/>
					<Controller
						name="strength"
						control={control}
						render={({ field }) => (
							<Input
								id="strength_input"
								type="number"
								min={0}
								max={100}
								value={field.value}
								onChange={(e) => field.onChange(Number(e.target.value))}
								disabled={isStrengthDisabled}
								className="w-20 text-center"
							/>
						)}
					/>
				</div>

				<Button
					type="submit"
					className="mt-4 cursor-pointer text-white hover:border-primary hover:border-2  transition-all duration-100"
				>
					Generate
				</Button>
			</Card>
		</form>
	);
}
