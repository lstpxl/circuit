import { createGrid } from "./Generator";
import { WIND_DIRECTIONS, type GeneratorParams } from "./types";

describe("createGrid", () => {
	const baseParams: GeneratorParams = {
		width: 4,
		height: 4,
		cohesion: 0,
		direction: WIND_DIRECTIONS.None,
		strength: 0,
		density: 50,
	};

	it("returns an array of lines with correct length based on density", () => {
		const lines = createGrid(baseParams);
		// There are 4 directions per cell, but flattenedGrid returns all possible lines
		const expectedLength = Math.floor(
			flattenedGridLength(baseParams.width, baseParams.height) *
				(baseParams.density / 100),
		);
		expect(lines.length).toBe(expectedLength);
	});

	it("all returned lines have status true", () => {
		const lines = createGrid(baseParams);
		for (const line of lines) {
			expect(line.status).toBe(true);
		}
	});

	it("returns empty array if density is 0", () => {
		const params = { ...baseParams, density: 0 };
		const lines = createGrid(params);
		expect(lines).toEqual([]);
	});

	it("returns all lines if density is 100", () => {
		const params = { ...baseParams, density: 100 };
		const lines = createGrid(params);
		const expectedLength = Math.floor(
			flattenedGridLength(params.width, params.height),
		);
		expect(lines.length).toBe(expectedLength);
	});

	it("does not mutate input params", () => {
		const params = { ...baseParams };
		createGrid(params);
		expect(params).toEqual(baseParams);
	});
});

// Helper to calculate the number of lines produced by flattenedGrid
function flattenedGridLength(width: number, height: number): number {
	let count = 0;
	for (let y = 0; y < height + 1; y++) {
		for (let x = 0; x < width + 1; x++) {
			if (x < width) count++; // r
			if (y < height) count++; // d
			if (y > 0 && x < width) count++; // a
			if (y < height && x < width) count++; // e
		}
	}
	return count;
}
