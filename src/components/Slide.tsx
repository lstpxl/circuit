import { useRef, useState, useMemo } from "react";
import { Pattern, type PatternDisplayData } from "./Pattern";
import { createGrid } from "@/model/Generator";
import type { WindDirection } from "@/model/GeneratorParams";

type SlideProps = {
	index: number;
	style?: React.CSSProperties;
};

const drawParams = {
	cellSize: 30,
	strokeWidth: 4,
	stroke: { color: "#f06", width: 4, linecap: "round" },
};

const windDirections: WindDirection[] = [
	"none",
	"vertical",
	"horizontal",
	"backslash",
	"slash",
	"orthogonal",
	"diagonal",
];

export default function Slide(props: SlideProps) {
	const { index, style } = props;

	// Generate random dimensions and parameters once and store in ref
	const randomParams = useRef({
		width: Math.floor(Math.random() * 10) + 2, // Random between 5-14
		height: Math.floor(Math.random() * 10) + 2, // Random between 5-14
		cohesion: Math.floor(-100 + Math.random() * 160), // Random between 0-100
		direction:
			windDirections[Math.floor(Math.random() * windDirections.length)],
		strength: Math.floor(Math.random() * 101), // Random between 0-100
		density: Math.floor(15 + Math.random() * 50), // Random between 0-100
	});

	const [width] = useState<number>(
		randomParams.current.width * drawParams.cellSize + drawParams.strokeWidth,
	);
	const [height] = useState<number>(
		randomParams.current.height * drawParams.cellSize + drawParams.strokeWidth,
	);
	const patternData = useRef<PatternDisplayData>({
		width: randomParams.current.width,
		height: randomParams.current.height,
		lines: createGrid({
			width: randomParams.current.width,
			height: randomParams.current.height,
			cohesion: randomParams.current.cohesion,
			direction: randomParams.current.direction,
			strength: randomParams.current.strength,
			density: randomParams.current.density,
		}),
	});

	const memoizedPattern = useMemo(
		() => <Pattern data={patternData.current} drawParams={drawParams} />,
		[],
	);

	return (
		<div
			data-index={index}
			className="bg-neutral-800 flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
			style={{ width: `${width + 60}px`, height: `${height + 60}px`, ...style }}
		>
			<div
				id="frame"
				className="relative border border-neutral-700 dark:border-neutral-700 rounded-lg p-[30px] group"
			>
				{memoizedPattern}
			</div>
		</div>
	);
}
