import { useCallback, useEffect } from "react";
import "./App.css";
import { SVG } from "@svgdotjs/svg.js";
import type { Svg, Container } from "@svgdotjs/svg.js";
import { weightedChoice } from "./weightedChoice";

const cellSize = 30;
const gridWidth = 7;
const gridHeight = 7;
const strokeWidth = 4;
const defaultStroke = { color: "#f06", width: strokeWidth, linecap: "round" };

type DrawPattern = (draw: Svg | Container) => void;

type Dir = "r" | "d" | "a" | "e"; // right, down, up-right, down-right

type DrawLine = (draw: Svg | Container, x: number, y: number, dir: Dir) => void;

const drawLine: DrawLine = (draw, x, y, dir) => {
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
		.line(x * cellSize, y * cellSize, x2 * cellSize, y2 * cellSize)
		.stroke(defaultStroke)
		.dmove(strokeWidth / 2, strokeWidth / 2);
};

type GridCell = { r: boolean; d: boolean; a: boolean; e: boolean };
type Grid = GridCell[][];

const vertexGrid: Grid = Array.from({ length: gridHeight + 1 }, () =>
	Array.from({ length: gridWidth + 1 }, () => ({
		r: false,
		d: false,
		a: false,
		e: false,
	})),
);

type Line = { x: number; y: number; dir: Dir; status: boolean };
type VertexCoords = Pick<Line, "x" | "y">;
type LineCoords = Pick<Line, "x" | "y" | "dir">;

const flattenedGrid = (grid: Grid): Line[] => {
	const result: Line[] = [];
	const maxx = grid[0].length - 1;
	const maxy = grid.length - 1;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (x < maxx) result.push({ x, y, dir: "r", status: grid[y][x].r });
			if (y < maxy) result.push({ x, y, dir: "d", status: grid[y][x].d });
			if (y > 0 && x < maxx)
				result.push({ x, y, dir: "a", status: grid[y][x].a });
			if (y < maxy && x < maxx)
				result.push({ x, y, dir: "e", status: grid[y][x].e });
		}
	}
	return result;
};

const getSecondVertexCoords = (line: LineCoords): VertexCoords => {
	if (line.dir === "r") {
		return { x: line.x + 1, y: line.y };
	}
	if (line.dir === "d") {
		return { x: line.x, y: line.y + 1 };
	}
	if (line.dir === "a") {
		return { x: line.x + 1, y: line.y - 1 };
	}
	if (line.dir === "e") {
		return { x: line.x + 1, y: line.y + 1 };
	}
	throw new Error("Invalid direction");
};

const getLinesFromVertex = (vertex: VertexCoords): LineCoords[] => {
	const lines: LineCoords[] = [];
	const { x, y } = vertex;
	lines.push({ x, y, dir: "r" });
	lines.push({ x, y, dir: "d" });
	lines.push({ x, y, dir: "a" });
	lines.push({ x, y, dir: "e" });
	lines.push({ x: x - 1, y: y + 1, dir: "a" });
	lines.push({ x: x - 1, y, dir: "r" });
	lines.push({ x: x - 1, y: y - 1, dir: "e" });
	lines.push({ x, y: y - 1, dir: "d" });
	return lines;
};

const linesEqual = (line1: LineCoords, line2: LineCoords): boolean => {
	return line1.x === line2.x && line1.y === line2.y && line1.dir === line2.dir;
};

const getFlatLineNeighbors = (line: LineCoords): LineCoords[] => {
	const secondVertex = getSecondVertexCoords(line);
	const first = getLinesFromVertex({ x: line.x, y: line.y });
	const second = getLinesFromVertex(secondVertex);
	const uniqueLines: LineCoords[] = [];

	for (const l of first.concat(second)) {
		if (l.x >= 0 && l.y >= 0 && l.x <= gridWidth && l.y <= gridHeight) {
			if (!uniqueLines.some((existing) => linesEqual(existing, l))) {
				uniqueLines.push(l);
			}
		}
	}

	return uniqueLines.filter((l) => !linesEqual(l, line));
};

const correctWeightsNeighbors = (
	all: Line[],
	line: LineCoords,
	weights: number[],
): void => {
	const neighbors = getFlatLineNeighbors(line);
	for (const neighbor of neighbors) {
		const index = all.findIndex((l) => linesEqual(l, neighbor));
		if (index !== -1) {
			if (all[index].status === false) {
				weights[index] /= 5;
			}
		}
	}
};

const createGrid = (): Line[] => {
	const flat = flattenedGrid(vertexGrid);
	const fillRatio = 0.4;
	const numberOfLines = Math.floor(flat.length * fillRatio);
	const weights = flat.map((cell) =>
		cell.dir === "a" || cell.dir === "e" ? 3 : 1,
	);
	const result: Line[] = [];
	for (let i = 0; i < numberOfLines; i++) {
		const randomIndex = weightedChoice(weights);
		flat[randomIndex].status = true;
		correctWeightsNeighbors(flat, flat[randomIndex], weights);
		result.push(flat[randomIndex]);
		flat.splice(randomIndex, 1);
		weights.splice(randomIndex, 1);
	}
	return result;
};

// @ts-expect-error: Keeping for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createGrid_v1 = (): Line[] => {
	const flat = flattenedGrid(vertexGrid);
	const fillRatio = 0.3;
	const numberOfLines = Math.floor(flat.length * fillRatio);
	const weights = flat.map((cell) =>
		cell.dir === "a" || cell.dir === "e" ? 2 : 1,
	);
	const result: Line[] = [];
	for (let i = 0; i < numberOfLines; i++) {
		const randomIndex = weightedChoice(weights);
		flat[randomIndex].status = true;
		result.push(flat[randomIndex]);
		flat.splice(randomIndex, 1);
		weights.splice(randomIndex, 1);
	}
	return result;
};

const serializeGrid = (lines: Line[]): string => {
	const parts: string[] = [];
	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			for (const dir of ["r", "d", "a", "e"]) {
				const line = lines.find((l) => l.x === x && l.y === y && l.dir === dir);
				parts.push(line ? "1" : "0");
			}
		}
		const line = lines.find(
			(l) => l.x === gridWidth && l.y === y && l.dir === "d",
		);
		parts.push(line ? "1" : "0");
	}
	for (let x = 0; x < gridWidth; x++) {
		const line = lines.find(
			(l) => l.x === x && l.y === gridHeight && l.dir === "r",
		);
		parts.push(line ? "1" : "0");
	}
	return parts.join("");
};

const bin2base64 = (str: string): string => {
	const bin = str.match(/.{1,8}/g);
	if (!bin) return "";
	const base64 = bin
		.map((b) => String.fromCharCode(Number.parseInt(b, 2)))
		.join("");
	return `${gridWidth}x${gridHeight}x${btoa(base64)}`;
};

// @ts-expect-error: Keeping for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const base64ToBin = (base64: string): string => {
	const match = base64.match(/^(\d+)x(\d+)x(.+)$/);
	if (!match) {
		throw new Error("Invalid base64 format");
	}
	// console.log("match:", match);
	const [, width, height, base64Data] = match;
	if (
		Number.parseInt(width) !== gridWidth ||
		Number.parseInt(height) !== gridHeight
	) {
		throw new Error("Grid dimensions do not match");
	}
	const expectedLength =
		4 * Number.parseInt(width) * Number.parseInt(height) +
		Number.parseInt(width) +
		Number.parseInt(height);
	// console.log("base64Data:", base64Data);
	const decoded = atob(base64Data);
	let bin = "";
	const lastOctetLength = expectedLength % 8;
	for (let i = 0; i < decoded.length; i++) {
		if (i === decoded.length - 1 && lastOctetLength > 0) {
			bin += decoded.charCodeAt(i).toString(2).padStart(lastOctetLength, "0");
		} else {
			bin += decoded.charCodeAt(i).toString(2).padStart(8, "0");
		}
	}
	return bin;
};

const drawPattern: DrawPattern = (draw) => {
	const flat = createGrid();
	const code = serializeGrid(flat);
	for (const { x, y, dir, status } of flat) {
		if (status) {
			drawLine(draw, x, y, dir);
		}
	}
	// console.log("Generate:", code);
	console.log("Generated code base64:", bin2base64(code));
	// console.log("Reverted:", base64ToBin(bin2base64(code)));
	// console.log("Equal:", code === base64ToBin(bin2base64(code)));
};

function App() {
	const createSVG = useCallback(() => {
		// Clear existing content first
		const container = document.getElementById("drawing-container");
		if (container) {
			container.innerHTML = "";
		}

		// Create new SVG instance
		const draw = SVG()
			.size(
				gridWidth * cellSize + strokeWidth,
				gridHeight * cellSize + strokeWidth,
			)
			.addTo("#drawing-container");

		drawPattern(draw);
		return draw;
	}, []);

	useEffect(() => {
		createSVG();
		return () => {
			const container = document.getElementById("drawing-container");
			if (container) {
				container.innerHTML = "";
			}
		};
	}, [createSVG]);

	const handleRefresh = () => {
		createSVG();
	};

	return (
		<div
			style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
		>
			<div
				id="drawing-container"
				style={{
					width: gridWidth * cellSize + strokeWidth,
					height: gridHeight * cellSize + strokeWidth,
					overflow: "hidden",
				}}
			/>
			<button
				type="button"
				onClick={() => handleRefresh()}
				style={{
					marginTop: "80px",
					padding: "10px 20px",
					fontSize: "16px",
					cursor: "pointer",
				}}
			>
				Generate
			</button>
		</div>
	);
}

export default App;
