export type WindDirection =
	| "none"
	| "vertical"
	| "horizontal"
	| "backslash"
	| "slash"
	| "orthogonal"
	| "diagonal";

export type GeneratorParams = {
	gridSize: number;
	cohesion: number;
	direction: WindDirection;
	strength: number;
	density: number;
};

export const defaultGeneratorParams: GeneratorParams = {
	gridSize: 7,
	cohesion: 0,
	direction: "none",
	strength: 0,
	density: 40,
};
