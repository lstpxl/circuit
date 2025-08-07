import {
	useEffect,
	useRef,
	useState,
	useCallback,
	useLayoutEffect,
} from "react";
import Slide from "./Slide";
import type { Dimensions } from "@/model/Grid";

type Coords = {
	x: number;
	y: number;
};

const GAP = 128; // Gap between slides in pixels
const STEP = 4; // Step size for each animation frame

function calculateInitSlidePosition(
	slideDimensions: Dimensions[],
	containerDimensions: Dimensions,
): Coords[] {
	const result = [] as Coords[];
	let cursorX = containerDimensions.width + GAP; // Start just outside the right edge of the container
	for (let i = 0; i < slideDimensions.length; i++) {
		result.push({
			x: cursorX,
			y: containerDimensions.height / 2 - slideDimensions[i].height / 2,
		});
		cursorX += slideDimensions[i].width + GAP; // Move cursor to the right for the next slide
	}
	return result;
}

function arcY(x: number, containerDimensions: Dimensions): number {
	const nX =
		((x - containerDimensions.width / 2) / containerDimensions.width) * 0.5; // Normalize x to the range [0, 1]
	const y = -Math.sqrt(1 - nX * nX);
	const scale = containerDimensions.width * 4;
	const result = -scale * (1 + y) - containerDimensions.height * 0.05;
	return result;
}

function moveSlideOneStep(
	slideDimensions: Dimensions[],
	containerDimensions: Dimensions,
	coords: Coords[],
): Coords[] {
	let requeueIndex = -1; // Index of the slide that has moved out of view
	let rightmostX = Number.NEGATIVE_INFINITY; // Track the rightmost x position of the slides
	const result = [] as Coords[];
	for (let i = 0; i < coords.length; i++) {
		result.push({
			x: coords[i].x - STEP,
			y:
				arcY(
					coords[i].x - STEP + slideDimensions[i].width / 2,
					containerDimensions,
				) +
				containerDimensions.height / 2 -
				slideDimensions[i].height / 2,
		});
		const nextX = coords[i].x - STEP + slideDimensions[i].width + GAP;
		if (nextX < 0) {
			// If the slide has moved out of view, reset its position after the last slide
			if (requeueIndex === -1) {
				requeueIndex = i; // Store the index of the first slide that moved out of view
			}
		}
		if (nextX > rightmostX) {
			rightmostX = nextX; // Update the rightmost x position
		}
	}
	if (requeueIndex !== -1) {
		// If a slide has moved out of view, requeue it at the end
		// const requeuedSlide = coords[requeueIndex];
		result[requeueIndex] = {
			x: rightmostX,
			y:
				containerDimensions.height / 2 -
				slideDimensions[requeueIndex].height / 2,
		};
	}
	return result;
}

function updateSlidesY(
	slideDimensions: Dimensions[],
	containerDimensions: Dimensions,
	coords: Coords[],
): Coords[] {
	const result = [] as Coords[];
	for (let i = 0; i < coords.length; i++) {
		result.push({
			x: coords[i].x,
			y:
				arcY(
					coords[i].x - STEP + slideDimensions[i].width / 2,
					containerDimensions,
				) +
				containerDimensions.height / 2 -
				slideDimensions[i].height / 2,
		});
	}
	return result;
}

export default function Carousel() {
	const containerRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<number | null>(null);
	const initialPositionsSet = useRef(false);
	const coordsRef = useRef<Coords[]>([]); // Add this ref

	const [slideDimensions, setSlideDimensions] = useState([] as Dimensions[]);
	const [coords, setCoords] = useState([] as Coords[]);
	const [containerDimensions, setContainerDimensions] = useState({
		width: 0,
		height: 0,
	} as Dimensions);

	// Update ref whenever coords changes
	useEffect(() => {
		coordsRef.current = coords;
	}, [coords]);

	const myAnimate = useCallback(() => {
		const newCoords = moveSlideOneStep(
			slideDimensions,
			containerDimensions,
			coordsRef.current,
		);
		setCoords(newCoords);
		animationRef.current = requestAnimationFrame(myAnimate);
	}, [containerDimensions, slideDimensions]);

	useLayoutEffect(() => {
		function updateViewport() {
			if (containerRef.current) {
				const { width, height } = containerRef.current.getBoundingClientRect();
				setContainerDimensions({ width, height });

				// Use ref to get current coords
				const currentCoords = coordsRef.current;
				if (currentCoords.length > 0) {
					const newCoords = updateSlidesY(
						slideDimensions,
						{ width, height },
						currentCoords,
					);
					setCoords(newCoords);
				}
			}
		}

		updateViewport();

		if (slideDimensions.length === 0 && containerRef.current) {
			const container = containerRef.current;
			const slides = Array.from(container.children) as HTMLElement[];
			const dimensions = slides.map((slide) => {
				const rect = slide.getBoundingClientRect();
				return {
					width: rect.width,
					height: rect.height,
				};
			});
			setSlideDimensions(dimensions);
		}

		window.addEventListener("resize", updateViewport);
		return () => {
			window.removeEventListener("resize", updateViewport);
		};
	}, [slideDimensions]);

	// Add a separate effect to update coordinates when dimensions change
	useLayoutEffect(() => {
		if (
			slideDimensions.length > 0 &&
			containerDimensions.width > 0 &&
			!initialPositionsSet.current
		) {
			const newCoords = calculateInitSlidePosition(
				slideDimensions,
				containerDimensions,
			);
			setCoords(newCoords);
			initialPositionsSet.current = true;
		}
	}, [slideDimensions, containerDimensions]);

	useEffect(() => {
		animationRef.current = requestAnimationFrame(myAnimate);
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [myAnimate]);

	return (
		<div className="w-full h-svh">
			<div
				ref={containerRef}
				className="flex gap-4 overflow-hidden relative h-svh"
			>
				{Array.from({ length: 14 }).map((_, index) => (
					<Slide
						// biome-ignore lint/suspicious/noArrayIndexKey: Using index as key for simplicity in this example
						key={index}
						index={index}
						style={{
							position: "absolute",
							transform: `translate3d(${coords[index]?.x || 0}px, ${coords[index]?.y || 0}px, 0)`,
						}}
					/>
				))}
			</div>
		</div>
	);
}
