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

	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(code);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
		const button = document.getElementById("copy-code-button");
		if (button) {
			button.style.opacity = "0";
			setTimeout(() => {
				button.style.opacity = "100%";
			}, 1000);
		}
	};

	const handleDownloadSVG = () => {
		const svgElement = document.querySelector("#frame svg");
		if (svgElement) {
			const svgData = new XMLSerializer().serializeToString(svgElement);
			const svgBlob = new Blob([svgData], {
				type: "image/svg+xml;charset=utf-8",
			});
			const svgUrl = URL.createObjectURL(svgBlob);
			const downloadLink = document.createElement("a");
			downloadLink.href = svgUrl;
			downloadLink.download = "circuit-pattern.svg";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			URL.revokeObjectURL(svgUrl);
		}
		const button = document.getElementById("download-svg-button");
		if (button) {
			button.style.opacity = "0";
			setTimeout(() => {
				button.style.opacity = "100%";
			}, 1000);
		}
	};

	return (
		<div className="dark flex flex-col items-center gap-16">
			<div className="flex flex-col items-center gap-4">
				<div
					id="frame"
					className="relative border border-neutral-300 dark:border-neutral-700 rounded-lg p-[30px] group"
				>
					<Pattern data={patternData} drawParams={drawParams} />
					<div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<button
							id="copy-code-button"
							type="button"
							onClick={handleCopyCode}
							className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-md transition-colors cursor-pointer"
							title="Copy code"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>Copy code</title>
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						</button>
						<button
							id="download-svg-button"
							type="button"
							onClick={handleDownloadSVG}
							className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-md transition-colors cursor-pointer"
							title="Download SVG"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>Download SVG</title>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7,10 12,15 17,10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
						</button>
					</div>
				</div>
			</div>
			<GenerationForm
				onParamGenerate={handleGenerateFromParams}
				onCodeGenerate={handleGenerateFromCode}
			/>
		</div>
	);
}

export default App;
