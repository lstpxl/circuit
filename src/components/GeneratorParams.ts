export type GeneratorParams = {
	gridSize: number;
	cohesion: number;
	direction: string;
	strength: number;
};

export const defaultGeneratorParams: GeneratorParams = {
	gridSize: 7,
	cohesion: 0,
	direction: "none",
	strength: 0,
};
