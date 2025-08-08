import { bareBin2base64 } from "./encode";
import { ValidationError } from "../../../model/errors";
import type { Dimensions } from "../../../model/Grid";

type CodeParseResult = {
	width: number;
	height: number;
	expectedLength: number;
	binary: string;
};

export function validateCode(code: string): CodeParseResult | false {
	const regex = /^(\d+)x(\d+)x([A-Za-z0-9_-]+)$/;
	const match = code.match(regex);
	if (!match) return false;
	const [, widthStr, heightStr, base64Data] = match;
	const width = Number.parseInt(widthStr);
	if (Number.isNaN(width) || width <= 0) return false;
	if (width > 25 || width < 1) return false;
	const height = Number.parseInt(heightStr);
	if (Number.isNaN(height) || height <= 0) return false;
	if (height > 25 || height < 1) return false;
	const expectedLength = 4 * width * height + 2 * width + height;

	const zeroString = "0".repeat(expectedLength);
	const encoded = bareBin2base64(zeroString);
	if (encoded.length !== base64Data.length) {
		return false;
	}

	// Convert URL-safe base64 back to standard base64
	let standardBase64 = base64Data.replace(/-/g, "+").replace(/_/g, "/");

	// Add padding if needed
	while (standardBase64.length % 4) {
		standardBase64 += "=";
	}

	const binaryString = atob(standardBase64);
	let bin = "";
	const lastOctetLength = expectedLength % 8;
	for (let i = 0; i < binaryString.length; i++) {
		if (i === binaryString.length - 1 && lastOctetLength > 0) {
			bin += binaryString
				.charCodeAt(i)
				.toString(2)
				.padStart(lastOctetLength, "0");
		} else {
			bin += binaryString.charCodeAt(i).toString(2).padStart(8, "0");
		}
	}

	const result = {
		width: width,
		height: height,
		expectedLength: expectedLength,
		binary: bin,
	};

	return result;
}

export function getDimensionsFromCode(code: string): Dimensions | false {
	const regex = /^(\d+)x(\d+)x([A-Za-z0-9_-]+)$/;
	const match = code.match(regex);
	if (!match) return false;
	const [, widthStr, heightStr, base64Data] = match;
	if (!base64Data || base64Data.length === 0) return false;
	const width = Number.parseInt(widthStr);
	if (Number.isNaN(width) || width <= 0) return false;
	if (width > 25 || width < 1) return false;
	const height = Number.parseInt(heightStr);
	if (Number.isNaN(height) || height <= 0) return false;
	if (height > 25 || height < 1) return false;
	return { width, height };
}

export function validateCodeStrict(code: string): CodeParseResult {
	const regex = /^(\d+)x(\d+)x([A-Za-z0-9_-]+)$/;
	const match = code.match(regex);

	if (!match) {
		throw new ValidationError(
			"Code format is invalid",
			"format",
			code,
			"Expected format: WIDTHxHEIGHTxBASE64",
		);
	}

	const [, widthStr, heightStr, base64Data] = match;

	const width = Number.parseInt(widthStr);
	if (Number.isNaN(width) || width <= 0) {
		throw new ValidationError(
			`Width must be a positive integer, got: ${widthStr}`,
			"width",
			widthStr,
			"1-25",
		);
	}

	if (width > 25) {
		throw new ValidationError(
			`Width cannot exceed 25, got: ${width}`,
			"width",
			width,
			"1-25",
		);
	}

	const height = Number.parseInt(heightStr);
	if (Number.isNaN(height) || height <= 0) {
		throw new ValidationError(
			`Height must be a positive integer, got: ${heightStr}`,
			"height",
			heightStr,
			"1-25",
		);
	}

	if (height > 25) {
		throw new ValidationError(
			`Height cannot exceed 25, got: ${height}`,
			"height",
			height,
			"1-25",
		);
	}

	const expectedLength = 4 * width * height + 2 * width + height;

	const zeroString = "0".repeat(expectedLength);
	const encoded = bareBin2base64(zeroString);
	if (encoded.length !== base64Data.length) {
		// return false;
		throw new ValidationError(
			`Base64 data length mismatch. Expected ${encoded.length}, got ${base64Data.length}`,
			"base64",
			base64Data,
			`Expected length: ${encoded.length}`,
		);
	}

	// Convert URL-safe base64 back to standard base64
	let standardBase64 = base64Data.replace(/-/g, "+").replace(/_/g, "/");

	// Add padding if needed
	while (standardBase64.length % 4) {
		standardBase64 += "=";
	}

	let bin = "";
	const lastOctetLength = expectedLength % 8;
	try {
		const binaryString = atob(standardBase64);
		for (let i = 0; i < binaryString.length; i++) {
			if (i === binaryString.length - 1 && lastOctetLength > 0) {
				bin += binaryString
					.charCodeAt(i)
					.toString(2)
					.padStart(lastOctetLength, "0");
			} else {
				bin += binaryString.charCodeAt(i).toString(2).padStart(8, "0");
			}
		}
	} catch (error) {
		if (error instanceof ValidationError) {
			throw error;
		}
		throw new ValidationError(
			`Invalid base64 data: ${error instanceof Error ? error.message : "Invalid format"}`,
			"base64",
			base64Data,
			"Must be valid URL-safe base64",
		);
	}

	const result = {
		width: width,
		height: height,
		expectedLength: expectedLength,
		binary: bin,
	};

	return result;
}
