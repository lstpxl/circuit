import { useForm, Controller } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
	defaultGeneratorParams,
	type GeneratorParams,
} from "./GeneratorParams";

type GeneratorFormProps = {
	onGenerate: (data: GeneratorParams) => void;
} & React.FormHTMLAttributes<HTMLFormElement>;

export default function GeneratorForm(props: GeneratorFormProps) {
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
				{/* Grid Size */}
				<div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center w-full max-w-lg">
					<Label htmlFor="size_input" className="text-left">
						Grid size
					</Label>
					<Controller
						name="gridSize"
						control={control}
						render={({ field }) => (
							<Slider
								id="size_slider"
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
						name="gridSize"
						control={control}
						render={({ field }) => (
							<Input
								id="size_input"
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
					<Label htmlFor="direction_select" className="text-left">
						Accent direction
					</Label>
					<Controller
						name="direction"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className="w-[220px] justify-self-end">
									<SelectValue placeholder="Select direction" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="none">None</SelectItem>
										<SelectItem value="vertical">Vertical</SelectItem>
										<SelectItem value="horizontal">Horizontal</SelectItem>
										<SelectItem value="backslash">Backslash</SelectItem>
										<SelectItem value="slash">Slash</SelectItem>
										<SelectItem value="orthogonal">Orthogonal</SelectItem>
										<SelectItem value="diagonal">Diagonal</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
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
