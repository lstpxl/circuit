export type GeneratorParams = {
	width: number;
	height: number;
	cohesion: number;
	direction: WindDirection;
	strength: number;
	density: number;
};

export type WindDirection =
	| "none"
	| "vertical"
	| "horizontal"
	| "diagonal-backslash"
	| "diagonal-slash"
	| "orthogonal"
	| "diagonal";

export const WIND_DIRECTIONS = {
	None: "none",
	Vertical: "vertical",
	Horizontal: "horizontal",
	DiagonalBackslash: "diagonal-backslash",
	DiagonalSlash: "diagonal-slash",
	Orthogonal: "orthogonal",
	Diagonal: "diagonal",
} as const;
