import { WIND_DIRECTIONS, type GeneratorParams } from "./types";

export const defaultGeneratorParams: GeneratorParams = {
	width: 7,
	height: 7,
	cohesion: 0,
	direction: WIND_DIRECTIONS.None,
	strength: 50,
	density: 40,
};
