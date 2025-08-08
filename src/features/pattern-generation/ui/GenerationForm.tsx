import { memo, useState } from "react";
import type { GeneratorParams } from "@/features/pattern-generation/model/GeneratorParams";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { CodeGenerationForm, ParamGenerationForm } from "..";

type GenerationFormProps = {
	onParamGenerate: (data: GeneratorParams) => void;
	onCodeGenerate: (code: string) => void;
	initialCode?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const GenerationForm = memo(function GenerationForm(
	props: GenerationFormProps,
) {
	const { onParamGenerate, onCodeGenerate, initialCode, ...divProps } = props;
	const [activeTab, setActiveTab] = useState(initialCode ? "code" : "params");

	return (
		<div className="flex w-full max-w-2xl flex-col gap-2" {...divProps}>
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="params">Parameters</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className={activeTab === "params" ? "block" : "hidden"}>
				<ParamGenerationForm onGenerate={onParamGenerate} />
			</div>
			<div className={activeTab === "code" ? "block" : "hidden"}>
				<CodeGenerationForm
					onGenerate={onCodeGenerate}
					initialCode={initialCode}
				/>
			</div>
		</div>
	);
});
