export interface Dimensions {
	readonly width: number;
	readonly height: number;
}

export type Dir = "r" | "d" | "a" | "e"; // Keep as type for unions

export interface GridCell {
	r: boolean;
	d: boolean;
	a: boolean;
	e: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Grid extends ReadonlyArray<ReadonlyArray<GridCell>> {
	// This gives you array methods while being more specific
}

export interface VertexCoords {
	readonly x: number;
	readonly y: number;
}

export interface LineCoords extends VertexCoords {
	readonly dir: Dir;
}

export interface Line extends LineCoords {
	status: boolean;
}

export interface PatternDisplayable extends Dimensions {
	lines: Line[];
}
