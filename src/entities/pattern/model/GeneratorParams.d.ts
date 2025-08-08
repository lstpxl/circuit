export type WindDirection =
	| "none"
	| "vertical"
	| "horizontal"
	| "backslash"
	| "slash"
	| "orthogonal"
	| "diagonal";

export type GeneratorParams = {
	width: number;
	height: number;
	cohesion: number;
	direction: WindDirection;
	strength: number;
	density: number;
};
