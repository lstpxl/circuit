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
		2 * Number.parseInt(width) +
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
