import {
	getRandomWindDirection,
	type GeneratorParams,
} from "@/features/pattern-generation";

export const getRandomGenerationParams = (): GeneratorParams => {
	return {
		width: Math.floor(Math.random() * 10) + 2, // Random between 5-14
		height: Math.floor(Math.random() * 10) + 2, // Random between 5-14
		cohesion: Math.floor(-100 + Math.random() * 160), // Random between 0-100
		direction: getRandomWindDirection(),
		strength: Math.floor(Math.random() * 101), // Random between 0-100
		density: Math.floor(15 + Math.random() * 50), // Random between 0-100
	};
};
