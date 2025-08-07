import { validateCode } from "./codeValidator";
import { flattenedGrid, getEmptyVertexGrid } from "./Generator";
import type { Dimensions, Dir, Line } from "./Grid";

export const serializeGrid = (
	lines: Line[],
	dimensions: Dimensions,
): string => {
	const parts: string[] = [];
	for (let y = 0; y < dimensions.height; y++) {
		for (let x = 0; x < dimensions.width; x++) {
			for (const dir of ["r", "d", "a", "e"]) {
				const line = lines.find((l) => l.x === x && l.y === y && l.dir === dir);
				parts.push(line ? "1" : "0");
			}
		}
		const line = lines.find(
			(l) => l.x === dimensions.width && l.y === y && l.dir === "d",
		);
		parts.push(line ? "1" : "0");
	}
	for (let x = 0; x < dimensions.width; x++) {
		const line1 = lines.find(
			(l) => l.x === x && l.y === dimensions.height && l.dir === "a",
		);
		parts.push(line1 ? "1" : "0");
		const line = lines.find(
			(l) => l.x === x && l.y === dimensions.height && l.dir === "r",
		);
		parts.push(line ? "1" : "0");
	}
	return parts.join("");
};

// TODO: use version, defined in RFC 4648, section 5,
// omits the padding and replaces + and / with - and _.

export const bareBin2base64 = (str: string): string => {
	const bin = str.match(/.{1,8}/g);
	if (!bin) return "";
	const base64 = bin
		.map((b) => String.fromCharCode(Number.parseInt(b, 2)))
		.join("");
	return btoa(base64).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

export const bin2base64 = (str: string, dimensions: Dimensions): string => {
	const bin = str.match(/.{1,8}/g);
	if (!bin) return "";
	const base64 = bin
		.map((b) => String.fromCharCode(Number.parseInt(b, 2)))
		.join("");
	const urlSafeBase64 = btoa(base64)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
	return `${dimensions.width}x${dimensions.height}x${urlSafeBase64}`;
};

// @ts-expect-error: Keeping for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const base64ToBin = (base64: string, dimensions: Dimensions): string => {
	const match = base64.match(/^(\d+)x(\d+)x(.+)$/);
	if (!match) {
		throw new Error("Invalid base64 format");
	}
	const [, width, height, base64Data] = match;
	if (
		Number.parseInt(width) !== dimensions.width ||
		Number.parseInt(height) !== dimensions.height
	) {
		throw new Error("Grid dimensions do not match");
	}
	const expectedLength =
		4 * Number.parseInt(width) * Number.parseInt(height) +
		Number.parseInt(width) +
		Number.parseInt(height);

	// Convert URL-safe base64 back to standard base64
	let standardBase64 = base64Data.replace(/-/g, "+").replace(/_/g, "/");

	// Add padding if needed
	while (standardBase64.length % 4) {
		standardBase64 += "=";
	}

	const decoded = atob(standardBase64);
	let bin = "";
	const lastOctetLength = expectedLength % 8;
	for (let i = 0; i < decoded.length; i++) {
		if (i === decoded.length - 1 && lastOctetLength > 0) {
			bin += decoded.charCodeAt(i).toString(2).padStart(lastOctetLength, "0");
		} else {
			bin += decoded.charCodeAt(i).toString(2).padStart(8, "0");
		}
	}
	return bin;
};

export type Pattern2Code = (pattern: Line[], dimensions: Dimensions) => string;
export const pattern2code: Pattern2Code = (pattern, dimensions) => {
	const binary = serializeGrid(pattern, dimensions);
	const code = bin2base64(binary, dimensions);
	return code;
};

export const createGridFromCode = (code: string): Line[] => {
	const parsed = validateCode(code);
	if (!parsed) {
		throw new Error("Invalid code format");
	}
	try {
		const empty = getEmptyVertexGrid(parsed.width, parsed.height);
		const dimensions: Dimensions = {
			width: parsed.width,
			height: parsed.height,
		};
		// Set status of lines based on the binary string
		const queue = parsed.binary.split("");
		for (let y = 0; y < dimensions.height; y++) {
			for (let x = 0; x < dimensions.width; x++) {
				for (const dir of ["r", "d", "a", "e"] as Dir[]) {
					const status = Number.parseInt(queue.shift() || "0") === 1;
					empty[y][x][dir] = status;
				}
			}
			const status = Number.parseInt(queue.shift() || "0") === 1;
			empty[y][dimensions.width].d = status;
		}
		for (let x = 0; x < dimensions.width; x++) {
			const status1 = Number.parseInt(queue.shift() || "0") === 1;
			empty[dimensions.height][x].a = status1;
			const status = Number.parseInt(queue.shift() || "0") === 1;
			empty[dimensions.height][x].r = status;
		}

		// Convert the grid to a flat array of lines
		const flat = flattenedGrid(empty);
		return flat;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to create grid from code: ${error.message}`);
		}
		throw new Error("Failed to create grid from code: Unknown error");
	}
};
