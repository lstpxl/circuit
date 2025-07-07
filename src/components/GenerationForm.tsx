import CodeGenerationForm from "./CodeGenerationForm";
import type { GeneratorParams } from "./GeneratorParams";
import ParamGenerationForm from "./ParamGenerationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type GenerationFormProps = {
	onParamGenerate: (data: GeneratorParams) => void;
	onCodeGenerate: (code: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GenerationForm(props: GenerationFormProps) {
	const { onParamGenerate, onCodeGenerate, ...divProps } = props;

	return (
		<div className="flex w-full max-w-2xl flex-col gap-6" {...divProps}>
			<Tabs defaultValue="params">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="params">Parameters</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>
				<TabsContent value="params">
					<ParamGenerationForm onGenerate={onParamGenerate} />
				</TabsContent>
				<TabsContent value="code">
					<CodeGenerationForm onGenerate={onCodeGenerate} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
