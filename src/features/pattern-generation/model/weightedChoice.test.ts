import { weightedChoice } from "./weightedChoice";

describe("weightedChoice", () => {
	it("returns 0 for single-element array", () => {
		expect(weightedChoice([1])).toBe(0);
	});

	it("returns only valid indices", () => {
		const weights = [1, 2, 3, 4];
		for (let i = 0; i < 100; i++) {
			const idx = weightedChoice(weights);
			expect(idx).toBeGreaterThanOrEqual(0);
			expect(idx).toBeLessThan(weights.length);
		}
	});

	it("returns higher indices more often for higher weights", () => {
		const weights = [1, 1, 8];
		const counts = [0, 0, 0];
		const trials = 10000;
		for (let i = 0; i < trials; i++) {
			counts[weightedChoice(weights)]++;
		}
		// The last index should be chosen most often
		expect(counts[2]).toBeGreaterThan(counts[0]);
		expect(counts[2]).toBeGreaterThan(counts[1]);
	});

	it("handles all weights equal", () => {
		const weights = [1, 1, 1, 1];
		const counts = [0, 0, 0, 0];
		const trials = 10000;
		for (let i = 0; i < trials; i++) {
			counts[weightedChoice(weights)]++;
		}
		// All counts should be roughly equal (allowing some variance)
		const avg = trials / weights.length;
		for (const count of counts) {
			expect(count).toBeGreaterThan(avg * 0.7);
			expect(count).toBeLessThan(avg * 1.3);
		}
	});

	it("throws if weights is empty", () => {
		expect(() => weightedChoice([])).toThrow("Weights array is empty");
	});
});
