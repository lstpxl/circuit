import { useEffect } from "react";
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

const grid: Grid = Array.from({ length: gridHeight }, () =>
	Array.from({ length: gridWidth }, () => ({
		r: false,
		d: false,
		a: false,
		e: false,
	})),
);

type FlatCell = { x: number; y: number; dir: Dir; status: boolean };

const flattenedGrid = (grid: Grid): FlatCell[] => {
	const result: FlatCell[] = [];
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

const createGrid = (): FlatCell[] => {
	const flat = flattenedGrid(grid);
	const fillRatio = 0.3;
	const numberOfLines = Math.floor(flat.length * fillRatio);
	const weights = flat.map((cell) =>
		cell.dir === "a" || cell.dir === "e" ? 2 : 1,
	);
	const result: FlatCell[] = [];
	for (let i = 0; i < numberOfLines; i++) {
		const randomIndex = weightedChoice(weights);
		flat[randomIndex].status = true;
		result.push(flat[randomIndex]);
		flat.splice(randomIndex, 1);
		weights.splice(randomIndex, 1);
	}
	return result;
};

const drawPattern: DrawPattern = (draw) => {
	const flat = createGrid();
	for (const { x, y, dir, status } of flat) {
		if (status) {
			drawLine(draw, x, y, dir);
		}
	}
};

function App() {
	useEffect(() => {
		const draw = SVG()
			.size(
				gridWidth * cellSize + strokeWidth,
				gridHeight * cellSize + strokeWidth,
			)
			.addTo("#drawing-container");
		drawPattern(draw);
		return () => {
			const container = document.getElementById("drawing-container");
			if (container) {
				container.innerHTML = "";
			}
			draw.clear();
		};
	}, []);

	return (
		<div
			id="drawing-container"
			style={{
				width: gridWidth * cellSize + strokeWidth,
				height: gridHeight * cellSize + strokeWidth,
			}}
		/>
	);
}

export default App;
