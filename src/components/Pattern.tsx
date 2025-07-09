import { SVG } from "@svgdotjs/svg.js";
import type { Dir, Line } from "../model/Grid";
import { useEffect, useId } from "react";
import type { Svg, Container } from "@svgdotjs/svg.js";

export type PatternDisplayData = {
	width: number;
	height: number;
	lines: Line[];
};

export type DrawParams = {
	cellSize: number;
	strokeWidth: number;
	stroke: { color: string; width: number; linecap: string };
};

type DrawLine = (
	draw: Svg | Container,
	x: number,
	y: number,
	dir: Dir,
	drawParams: DrawParams,
) => void;

const drawLine: DrawLine = (draw, x, y, dir, drawParams: DrawParams) => {
	let x2 = x;
	let y2 = y;
	if (dir === "r") {
		x2 = x + 1;
	} else if (dir === "d") {
		y2 = y + 1;
	} else if (dir === "a") {
		x2 = x + 1;
		y2 = y - 1;
	} else if (dir === "e") {
		x2 = x + 1;
		y2 = y + 1;
	}
	draw
		.line(
			x * drawParams.cellSize,
			y * drawParams.cellSize,
			x2 * drawParams.cellSize,
			y2 * drawParams.cellSize,
		)
		.stroke(drawParams.stroke)
		.dmove(drawParams.strokeWidth / 2, drawParams.strokeWidth / 2);
};

type DrawPattern = (
	draw: Svg | Container,
	drawParams: DrawParams,
	pattern: Line[],
) => void;

const drawPattern: DrawPattern = (draw, drawParams, pattern) => {
	for (const { x, y, dir, status } of pattern) {
		if (status) {
			drawLine(draw, x, y, dir, drawParams);
		}
	}
};

export default function Pattern({
	data,
	drawParams,
}: {
	data: PatternDisplayData;
	drawParams: DrawParams;
}) {
	const containerId = useId();

	useEffect(() => {
		const container = document.getElementById(`#pattern-${containerId}`);
		if (container) {
			container.innerHTML = "";
		}
		const draw = SVG()
			.size(
				data.width * drawParams.cellSize + drawParams.strokeWidth,
				data.height * drawParams.cellSize + drawParams.strokeWidth,
			)
			.addTo(`#pattern-${containerId}`);
		// console.log("lines redraw");
		drawPattern(draw, drawParams, data.lines);

		return () => {
			const container = document.getElementById(`pattern-${containerId}`);
			if (container) {
				container.innerHTML = "";
			}
		};
	});

	// console.log("data", data);
	// console.log("drawParams", drawParams);
	console.log("Pattern rerender!");

	return (
		<div
			id={`pattern-${containerId}`}
			style={{
				width: data.width * drawParams.cellSize + drawParams.strokeWidth,
				height: data.height * drawParams.cellSize + drawParams.strokeWidth,
				overflow: "hidden",
			}}
			className="box-content"
		/>
	);
}
