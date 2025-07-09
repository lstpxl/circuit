export type Dir = "r" | "d" | "a" | "e"; // right, down, up-right, down-right

export type GridCell = { r: boolean; d: boolean; a: boolean; e: boolean };

export type Grid = GridCell[][];

export type Dimensions = { width: number; height: number };

export type Line = { x: number; y: number; dir: Dir; status: boolean };

export type VertexCoords = Pick<Line, "x" | "y">;

export type LineCoords = Pick<Line, "x" | "y" | "dir">;
