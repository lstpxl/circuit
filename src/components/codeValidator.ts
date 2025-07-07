import { bareBin2base64 } from "./Generator";

export function validateCode(code: string): boolean {
	const regex = /^(\d+)x(\d+)x([A-Za-z0-9+/=]+)$/;
	const match = code.match(regex);
	if (!match) return false;
	const [, widthStr, heightStr, base64Data] = match;
	const width = Number.parseInt(widthStr);
	if (Number.isNaN(width) || width <= 0) return false;
	if (width > 25 || width < 1) return false;
	const height = Number.parseInt(heightStr);
	if (Number.isNaN(height) || height <= 0) return false;
	if (height > 25 || height < 1) return false;
	const expectedLength = 4 * width * height + width + height;

	const zeroString = "0".repeat(expectedLength);
	const encoded = bareBin2base64(zeroString);
	if (encoded.length !== base64Data.length) {
		return false;
	}

	return true;
}
