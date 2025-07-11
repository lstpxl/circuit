import { bareBin2base64 } from "./encode";

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
