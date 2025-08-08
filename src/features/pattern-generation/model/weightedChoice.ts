/**
 * Selects a random index based on weighted probabilities
 * @param weights Array of positive weights
 * @returns Non-negative integer index (0 <= result < weights.length)
 */
export function weightedChoice(weights: number[]): number {
	// Compute prefix sums
	const prefixSums = [];
	let total = 0;
	for (const w of weights) {
		total += w;
		prefixSums.push(total);
	}

	// Pick random number in range [0, total)
	const r = Math.random() * total;

	// Binary search for the right index
	let low = 0;
	let high = prefixSums.length - 1;
	while (low < high) {
		const mid = Math.floor((low + high) / 2);
		if (r < prefixSums[mid]) {
			high = mid;
		} else {
			low = mid + 1;
		}
	}

	return low;
}
