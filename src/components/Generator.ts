import { weightedChoice } from "../weightedChoice";
import { validateCode } from "./codeValidator";
import type { GeneratorParams } from "./GeneratorParams";

export type Dir = "r" | "d" | "a" | "e"; // right, down, up-right, down-right

type GridCell = { r: boolean; d: boolean; a: boolean; e: boolean };
type Grid = GridCell[][];

export type Dimensions = { width: number; height: number };

const getEmptyVertexGrid = (gridWidth: number, gridHeight: number): Grid => {
	return Array.from({ length: gridHeight + 1 }, () =>
		Array.from({ length: gridWidth + 1 }, () => ({
			r: false,
			d: false,
			a: false,
			e: false,
		})),
	);
};

export type Line = { x: number; y: number; dir: Dir; status: boolean };
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

const getFlatLineNeighbors = (
	line: LineCoords,
	dimensions: Dimensions,
): LineCoords[] => {
	const secondVertex = getSecondVertexCoords(line);
	const first = getLinesFromVertex({ x: line.x, y: line.y });
	const second = getLinesFromVertex(secondVertex);
	const uniqueLines: LineCoords[] = [];

	for (const l of first.concat(second)) {
		if (
			l.x >= 0 &&
			l.y >= 0 &&
			l.x <= dimensions.width &&
			l.y <= dimensions.height
		) {
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
	dimensions: Dimensions,
	cohesion: number,
): void => {
	if (cohesion === 0) return;
	const coefficient =
		cohesion > 0 ? 1 + cohesion / 20 : 1 / (1 - cohesion / 20);
	const neighbors = getFlatLineNeighbors(line, dimensions);
	for (const neighbor of neighbors) {
		const index = all.findIndex((l) => linesEqual(l, neighbor));
		if (index !== -1) {
			if (all[index].status === false) {
				weights[index] *= coefficient;
			}
		}
	}
};

const weightCallback = (dir: Dir, generatorParams: GeneratorParams): number => {
	if (generatorParams.direction === "none") return 1;
	if (generatorParams.strength > 0) {
		if (generatorParams.direction === "vertical") {
			return dir === "d" ? generatorParams.strength / 10 : 1;
		}
		if (generatorParams.direction === "horizontal") {
			return dir === "r" ? generatorParams.strength / 10 : 1;
		}
		if (generatorParams.direction === "backslash") {
			return dir === "e" ? generatorParams.strength / 10 : 1;
		}
		if (generatorParams.direction === "slash") {
			return dir === "a" ? generatorParams.strength / 10 : 1;
		}
		if (generatorParams.direction === "orthogonal") {
			return dir === "d" || dir === "r" ? generatorParams.strength / 10 : 1;
		}
		if (generatorParams.direction === "diagonal") {
			return dir === "a" || dir === "e" ? generatorParams.strength / 10 : 1;
		}
	}
	return 1;
};

export const createGrid = (generatorParams: GeneratorParams): Line[] => {
	const empty = getEmptyVertexGrid(
		generatorParams.width,
		generatorParams.height,
	);
	const dimensions: Dimensions = {
		width: generatorParams.width,
		height: generatorParams.height,
	};
	const flat = flattenedGrid(empty);
	const fillRatio = generatorParams.density / 100;
	const numberOfLines = Math.floor(flat.length * fillRatio);
	const weights = flat.map((cell) => weightCallback(cell.dir, generatorParams));
	const result: Line[] = [];
	for (let i = 0; i < numberOfLines; i++) {
		const randomIndex = weightedChoice(weights);
		flat[randomIndex].status = true;
		correctWeightsNeighbors(
			flat,
			flat[randomIndex],
			weights,
			dimensions,
			generatorParams.cohesion,
		);
		result.push(flat[randomIndex]);
		flat.splice(randomIndex, 1);
		weights.splice(randomIndex, 1);
	}
	return result;
};

// @ts-expect-error: Keeping for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createGrid_v1 = (generatorParams: GeneratorParams): Line[] => {
	const empty = getEmptyVertexGrid(
		generatorParams.width,
		generatorParams.height,
	);
	const flat = flattenedGrid(empty);
	const fillRatio = 0.2;
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

export const serializeGrid = (
	lines: Line[],
	dimensions: Dimensions,
): string => {
	const parts: string[] = [];
	for (let y = 0; y < dimensions.height; y++) {
		for (let x = 0; x < dimensions.width; x++) {
			for (const dir of ["r", "d", "a", "e"]) {
				const line = lines.find((l) => l.x === x && l.y === y && l.dir === dir);
				parts.push(line ? "1" : "0");
			}
		}
		const line = lines.find(
			(l) => l.x === dimensions.width && l.y === y && l.dir === "d",
		);
		parts.push(line ? "1" : "0");
	}
	for (let x = 0; x < dimensions.width; x++) {
		const line1 = lines.find(
			(l) => l.x === x && l.y === dimensions.height && l.dir === "a",
		);
		parts.push(line1 ? "1" : "0");
		const line = lines.find(
			(l) => l.x === x && l.y === dimensions.height && l.dir === "r",
		);
		parts.push(line ? "1" : "0");
	}
	return parts.join("");
};

export const bareBin2base64 = (str: string): string => {
	const bin = str.match(/.{1,8}/g);
	if (!bin) return "";
	const base64 = bin
		.map((b) => String.fromCharCode(Number.parseInt(b, 2)))
		.join("");
	return btoa(base64);
};

export const bin2base64 = (str: string, dimensions: Dimensions): string => {
	const bin = str.match(/.{1,8}/g);
	if (!bin) return "";
	const base64 = bin
		.map((b) => String.fromCharCode(Number.parseInt(b, 2)))
		.join("");
	return `${dimensions.width}x${dimensions.height}x${btoa(base64)}`;
};

// @ts-expect-error: Keeping for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const base64ToBin = (base64: string, dimensions: Dimensions): string => {
	const match = base64.match(/^(\d+)x(\d+)x(.+)$/);
	if (!match) {
		throw new Error("Invalid base64 format");
	}
	const [, width, height, base64Data] = match;
	if (
		Number.parseInt(width) !== dimensions.width ||
		Number.parseInt(height) !== dimensions.height
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

type Pattern2Code = (pattern: Line[], dimensions: Dimensions) => string;
export const pattern2code: Pattern2Code = (pattern, dimensions) => {
	const binary = serializeGrid(pattern, dimensions);
	const code = bin2base64(binary, dimensions);
	return code;
};

export const createGridFromCode = (code: string): Line[] => {
	const parsed = validateCode(code);
	if (!parsed) {
		throw new Error("Invalid code format");
	}
	const empty = getEmptyVertexGrid(parsed.width, parsed.height);
	const dimensions: Dimensions = {
		width: parsed.width,
		height: parsed.height,
	};
	// Set status of lines based on the binary string
	const queue = parsed.binary.split("");
	for (let y = 0; y < dimensions.height; y++) {
		for (let x = 0; x < dimensions.width; x++) {
			for (const dir of ["r", "d", "a", "e"] as Dir[]) {
				const status = Number.parseInt(queue.shift() || "0") === 1;
				empty[y][x][dir] = status;
			}
		}
		const status = Number.parseInt(queue.shift() || "0") === 1;
		empty[y][dimensions.width].d = status;
	}
	for (let x = 0; x < dimensions.width; x++) {
		const status1 = Number.parseInt(queue.shift() || "0") === 1;
		empty[dimensions.height][x].a = status1;
		const status = Number.parseInt(queue.shift() || "0") === 1;
		empty[dimensions.height][x].r = status;
	}

	// Convert the grid to a flat array of lines
	const flat = flattenedGrid(empty);
	return flat;
};
