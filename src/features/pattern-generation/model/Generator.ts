import { weightedChoice } from "../../../model/weightedChoice";
import type { GeneratorParams } from "../../../model/GeneratorParams";
import type {
	Dimensions,
	Dir,
	Grid,
	Line,
	LineCoords,
	VertexCoords,
} from "../../../model/Grid";

export const getEmptyVertexGrid = (
	gridWidth: number,
	gridHeight: number,
): Grid => {
	return Array.from({ length: gridHeight + 1 }, () =>
		Array.from({ length: gridWidth + 1 }, () => ({
			r: false,
			d: false,
			a: false,
			e: false,
		})),
	);
};

export const flattenedGrid = (grid: Grid): Line[] => {
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
