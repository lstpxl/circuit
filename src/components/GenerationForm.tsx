import CodeGenerationForm from "./CodeGenerationForm";
import type { GeneratorParams } from "../model/GeneratorParams";
import ParamGenerationForm from "./ParamGenerationForm";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

type GenerationFormProps = {
	onParamGenerate: (data: GeneratorParams) => void;
	onCodeGenerate: (code: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GenerationForm(props: GenerationFormProps) {
	const { onParamGenerate, onCodeGenerate, ...divProps } = props;
	const [activeTab, setActiveTab] = useState("params");

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
				<CodeGenerationForm onGenerate={onCodeGenerate} />
			</div>
		</div>
	);
}
