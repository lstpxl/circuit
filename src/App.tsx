import { useState } from "react";
import "./App.css";

import {
	defaultGeneratorParams,
	type GeneratorParams,
} from "./components/GeneratorParams";
import {
	createGrid,
	createGridFromCode,
	pattern2code,
} from "./components/Generator";
import CodeText from "./components/CodeText";
import GenerationForm from "./components/GenerationForm";
import { validateCode } from "./components/codeValidator";
import type { PatternDisplayData } from "./components/Pattern";
import Pattern from "./components/Pattern";

const drawParams = {
	cellSize: 30,
	strokeWidth: 4,
	stroke: { color: "#f06", width: 4, linecap: "round" },
};

const initialPatternData: PatternDisplayData = {
    width: defaultGeneratorParams.width,
    height: defaultGeneratorParams.height,
    lines: createGrid(defaultGeneratorParams),
};

function App() {
	const [patternData, setPatternData] =
		useState<PatternDisplayData>(initialPatternData);
	const [code, setCode] = useState<string>(
		pattern2code(initialPatternData.lines, {
			width: initialPatternData.width,
			height: initialPatternData.height,
		}),
	);

	const handleGenerateFromParams = (params: GeneratorParams) => {
    const pattern = createGrid(params);
    setCode(
        pattern2code(pattern, {
            width: params.width,
            height: params.height,
        }),
    );
    setPatternData({
        width: params.width,
        height: params.height,
        lines: pattern,
    });
};

	const handleGenerateFromCode = (newCode: string) => {
		setCode(newCode);
		const pattern = createGridFromCode(newCode);
		const { width, height } = validateCode(newCode) || { width: 1 };
		setPatternData({
			width: width,
			height: height || 1,
			lines: pattern,
		});
	};

	return (
		<div className="dark flex flex-col items-center gap-16">
			<div className="flex flex-col items-center gap-4">
				<div className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-[30px]">
					<Pattern data={patternData} drawParams={drawParams} />
				</div>
				<CodeText code={code} />
			</div>
			<GenerationForm
				onParamGenerate={handleGenerateFromParams}
				onCodeGenerate={handleGenerateFromCode}
			/>
		</div>
	);
}

export default App;
