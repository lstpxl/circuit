import { useEffect, useState } from "react";
import "./App.css";
import { SVG } from "@svgdotjs/svg.js";
import type { Svg, Container } from "@svgdotjs/svg.js";

import {
	defaultGeneratorParams,
	type GeneratorParams,
} from "./components/GeneratorParams";
import {
	createGrid,
	pattern2code,
	type Dir,
	type Line,
} from "./components/Generator";
import CodeText from "./components/CodeText";
import GenerationForm from "./components/GenerationForm";

// type DrawLine = (draw: Svg | Container, x: number, y: number, dir: Dir) => void;

type DrawParams = {
	cellSize: number;
	strokeWidth: number;
	stroke: { color: string; width: number; linecap: string };
};

type DrawLine = (
	draw: Svg | Container,
	x: number,
	y: number,
	dir: Dir,
	drawParams: DrawParams,
) => void;

const drawLine: DrawLine = (draw, x, y, dir, drawParams: DrawParams) => {
	let x2 = x;
	let y2 = y;
	if (dir === "r") {
		x2 = x + 1;
	} else if (dir === "d") {
		y2 = y + 1;
	} else if (dir === "a") {
		x2 = x + 1;
		y2 = y - 1;
	} else if (dir === "e") {
		x2 = x + 1;
		y2 = y + 1;
	}
	draw
		.line(
			x * drawParams.cellSize,
			y * drawParams.cellSize,
			x2 * drawParams.cellSize,
			y2 * drawParams.cellSize,
		)
		.stroke(drawParams.stroke)
		.dmove(drawParams.strokeWidth / 2, drawParams.strokeWidth / 2);
};

type DrawPattern = (
	draw: Svg | Container,
	drawParams: DrawParams,
	pattern: Line[],
) => void;

const drawPattern: DrawPattern = (draw, drawParams, pattern) => {
	for (const { x, y, dir, status } of pattern) {
		if (status) {
			drawLine(draw, x, y, dir, drawParams);
		}
	}
};

const globDrawPattern = (
	// draw: Svg | Container,
	drawParams: DrawParams,
	generatorParams: GeneratorParams,
	pattern: Line[],
) => {
	const container = document.getElementById("drawing-container");
	if (container) {
		container.innerHTML = "";
	}

	// Create new SVG instance
	const draw = SVG()
		.size(
			generatorParams.gridSize * drawParams.cellSize + drawParams.strokeWidth,
			generatorParams.gridSize * drawParams.cellSize + drawParams.strokeWidth,
		)
		.addTo("#drawing-container");

	drawPattern(draw, drawParams, pattern);
};

const drawParams = {
	cellSize: 30,
	strokeWidth: 4,
	stroke: { color: "#f06", width: 4, linecap: "round" },
};

function App() {
	const [generatorParams, setGeneratorParams] = useState<GeneratorParams>(
		defaultGeneratorParams,
	);
	// Removed unused pattern state
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		const pattern = createGrid(generatorParams);
		setCode(
			pattern2code(pattern, {
				width: generatorParams.gridSize,
				height: generatorParams.gridSize,
			}),
		);
		globDrawPattern(drawParams, generatorParams, pattern);
		return () => {
			const container = document.getElementById("drawing-container");
			if (container) {
				container.innerHTML = "";
			}
		};
	}, [generatorParams]);

	const handleGenerate = (params: GeneratorParams) => {
		setGeneratorParams(params);
	};

	const handleGenerateFromCode = (code: string) => {
		console.log("Code ", code);
	};

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
			<div
				id="drawing-container"
				style={{
					width:
						generatorParams.gridSize * drawParams.cellSize +
						drawParams.strokeWidth,
					height:
						generatorParams.gridSize * drawParams.cellSize +
						drawParams.strokeWidth,
					overflow: "hidden",
				}}
				className="box-content border border-neutral-300 dark:border-neutral-700 rounded-lg p-[30px]"
			/>
			<CodeText code={code} />
			{/* <GeneratorForm onGenerate={handleGenerate} /> */}
			{/* <CodeForm onGenerate={handleGenerateFromCode} /> */}
			<GenerationForm
				onParamGenerate={handleGenerate}
				onCodeGenerate={handleGenerateFromCode}
			/>
		</div>
	);
}

export default App;
