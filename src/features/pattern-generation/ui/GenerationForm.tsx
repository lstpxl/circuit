import { memo, useState } from "react";
import CodeGenerationForm from "./CodeGenerationForm";
import type { GeneratorParams } from "@/model/GeneratorParams";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import ParamGenerationForm from "./ParamGenerationForm";

type GenerationFormProps = {
	onParamGenerate: (data: GeneratorParams) => void;
	onCodeGenerate: (code: string) => void;
	initialCode?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const GenerationForm = memo(function GenerationForm(
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

export default GenerationForm;
