import { useRef, useState, useMemo } from "react";
import { createPatternDisplayable } from "@/features/pattern-generation";
import { defaultDrawParams } from "@/features/pattern-display/model/defaultDrawParams";
import { Pattern } from "@/features/pattern-display/ui/Pattern";
import type { PatternDisplayable } from "@/entities/pattern";
import { getRandomGenerationParams } from "..";

type SlideProps = {
	index: number;
	style?: React.CSSProperties;
};

export function Slide(props: SlideProps) {
	const { index, style } = props;

	const randomParams = useRef(getRandomGenerationParams());

	const [width] = useState<number>(
		randomParams.current.width * defaultDrawParams.cellSize +
			defaultDrawParams.strokeWidth,
	);
	const [height] = useState<number>(
		randomParams.current.height * defaultDrawParams.cellSize +
			defaultDrawParams.strokeWidth,
	);
	const patternData = useRef<PatternDisplayable>(
		createPatternDisplayable(randomParams.current),
	);

	const memoizedPattern = useMemo(
		() => <Pattern data={patternData.current} drawParams={defaultDrawParams} />,
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
