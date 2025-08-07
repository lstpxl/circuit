import { validateCodeStrict } from "./codeValidator";
import { flattenedGrid, getEmptyVertexGrid } from "./Generator";
import type { Dimensions, Dir, Line } from "./Grid";
import {
	GridCreationError,
	EncodingError,
	ValidationError,
	InvalidCodeError,
} from "./errors";

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
	if (!str) return "";

	const bin = str.match(/.{1,8}/g);
	if (!bin || bin.length === 0) return "";

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

export type Pattern2Code = (pattern: Line[], dimensions: Dimensions) => string;
export const pattern2code: Pattern2Code = (pattern, dimensions) => {
	const binary = serializeGrid(pattern, dimensions);
	const code = bin2base64(binary, dimensions);
	return code;
};

type CreateGridResult = {
	lines: Line[];
	dimensions: Dimensions;
};

export const createGridFromCode = (code: string): CreateGridResult => {
	try {
		const parsed = validateCodeStrict(code);

		const empty = getEmptyVertexGrid(parsed.width, parsed.height);
		const dimensions: Dimensions = {
			width: parsed.width,
			height: parsed.height,
		};

		// Validate binary string length
		const expectedLength =
			4 * dimensions.width * dimensions.height +
			2 * dimensions.width +
			dimensions.height;
		// const expectedBase64Length = Math.ceil(expectedLength / 6) * 6;
		if (
			parsed.binary.length < expectedLength ||
			parsed.binary.length !== expectedLength
		) {
			throw new GridCreationError(
				`Binary string length mismatch. Expected ${expectedLength}, got ${parsed.binary.length}`,
				code,
				dimensions,
			);
		}

		// Set status of lines based on the binary string
		const queue = parsed.binary.split("");

		// try {
		for (let y = 0; y < dimensions.height; y++) {
			for (let x = 0; x < dimensions.width; x++) {
				for (const dir of ["r", "d", "a", "e"] as Dir[]) {
					const bitValue = queue.shift();
					if (bitValue === undefined) {
						throw new EncodingError(
							`Unexpected end of binary data at position (${x}, ${y}, ${dir})`,
							"deserialize",
						);
					}
					const status = Number.parseInt(bitValue) === 1;
					empty[y][x][dir] = status;
				}
			}
			const bitValue = queue.shift();
			if (bitValue === undefined) {
				throw new EncodingError(
					`Unexpected end of binary data at edge position (${dimensions.width}, ${y})`,
					"deserialize",
				);
			}
			const status = Number.parseInt(bitValue) === 1;
			empty[y][dimensions.width].d = status;
		}

		for (let x = 0; x < dimensions.width; x++) {
			const bitValue1 = queue.shift();
			const bitValue2 = queue.shift();
			if (bitValue1 === undefined || bitValue2 === undefined) {
				throw new EncodingError(
					`Unexpected end of binary data at bottom edge position (${x}, ${dimensions.height})`,
					"deserialize",
				);
			}
			const status1 = Number.parseInt(bitValue1) === 1;
			const status2 = Number.parseInt(bitValue2) === 1;
			empty[dimensions.height][x].a = status1;
			empty[dimensions.height][x].r = status2;
		}

		// Convert the grid to a flat array of lines
		const flat = flattenedGrid(empty);
		return {
			lines: flat,
			dimensions,
		};
	} catch (error) {
		if (error instanceof ValidationError) {
			/* console.error(`${error.field}: ${error.message}`);
			if (error.constraint) {
				console.error(`Expected: ${error.constraint}`);
			} */
			throw new InvalidCodeError(error.message, code, error.constraint);
		}

		if (error instanceof GridCreationError || error instanceof EncodingError) {
			throw error; // Re-throw our custom errors
		}

		throw new GridCreationError(
			`Failed to create grid from code: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
			code,
		);
	}
};
