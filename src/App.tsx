import { useEffect, useState } from "react";
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

function App() {
	const [generatorParams, setGeneratorParams] = useState<GeneratorParams>(
		defaultGeneratorParams,
	);
	const [patternData, setPatternData] = useState<PatternDisplayData>({
		width: defaultGeneratorParams.gridSize,
		height: defaultGeneratorParams.gridSize,
		lines: createGrid(generatorParams),
	});
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		setCode(
			pattern2code(patternData.lines, {
				width: patternData.width,
				height: patternData.height,
			}),
		);
	}, [patternData, patternData.lines]);

	const handleGenerateFromParams = (params: GeneratorParams) => {
		setGeneratorParams(params);
		// console.log("creating from params", params);
		const pattern = createGrid(params);
		setCode(
			pattern2code(pattern, {
				width: generatorParams.gridSize,
				height: generatorParams.gridSize,
			}),
		);
		setPatternData({
			width: generatorParams.gridSize,
			height: generatorParams.gridSize,
			lines: pattern,
		});
	};

	const handleGenerateFromCode = (newCode: string) => {
		setCode(newCode);
		console.log("set code", newCode);
		const pattern = createGridFromCode(newCode);
		const { width, height } = validateCode(newCode) || { width: 1 };
		setPatternData({
			width: width,
			height: height || 1,
			lines: pattern,
		});
	};

	console.log("code when render", code);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "20px",
			}}
			className="dark"
		>
			<div className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-[30px]">
				<Pattern data={patternData} drawParams={drawParams} />
			</div>
			<CodeText code={code} />
			<GenerationForm
				onParamGenerate={handleGenerateFromParams}
				onCodeGenerate={handleGenerateFromCode}
			/>
		</div>
	);
}

export default App;
