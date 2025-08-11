import { getRandomGenerationParams } from "../getRandomGenerationParams";
import { getRandomWindDirection } from "@/features/pattern-generation";

// Mock the external dependency
jest.mock("@/features/pattern-generation", () => ({
	getRandomWindDirection: jest.fn(),
	WIND_DIRECTIONS: {
		None: "none",
		Vertical: "vertical",
		Horizontal: "horizontal",
		DiagonalBackslash: "diagonal-backslash",
		DiagonalSlash: "diagonal-slash",
		Orthogonal: "orthogonal",
		Diagonal: "diagonal",
	},
}));

const mockedGetRandomWindDirection =
	getRandomWindDirection as jest.MockedFunction<typeof getRandomWindDirection>;

describe("getRandomGenerationParams", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedGetRandomWindDirection.mockReturnValue("none");
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should return an object with all required properties", () => {
		const result = getRandomGenerationParams();

		expect(result).toHaveProperty("width");
		expect(result).toHaveProperty("height");
		expect(result).toHaveProperty("cohesion");
		expect(result).toHaveProperty("direction");
		expect(result).toHaveProperty("strength");
		expect(result).toHaveProperty("density");
	});

	it("should return numbers for all numeric properties", () => {
		const result = getRandomGenerationParams();

		expect(typeof result.width).toBe("number");
		expect(typeof result.height).toBe("number");
		expect(typeof result.cohesion).toBe("number");
		expect(typeof result.strength).toBe("number");
		expect(typeof result.density).toBe("number");
	});

	it("should call getRandomWindDirection for direction", () => {
		getRandomGenerationParams();

		expect(mockedGetRandomWindDirection).toHaveBeenCalledTimes(1);
	});

	it("should use the direction from getRandomWindDirection", () => {
		mockedGetRandomWindDirection.mockReturnValue("diagonal-backslash");

		const result = getRandomGenerationParams();

		expect(result.direction).toBe("diagonal-backslash");
	});

	describe("property ranges", () => {
		it("should generate width in range 2-11", () => {
			// Test minimum value (Math.random() = 0)
			jest.spyOn(Math, "random").mockReturnValue(0);
			let result = getRandomGenerationParams();
			expect(result.width).toBe(2);

			// Test maximum value (Math.random() = 0.999...)
			jest.spyOn(Math, "random").mockReturnValue(0.999);
			result = getRandomGenerationParams();
			expect(result.width).toBe(11);
		});

		it("should generate height in range 2-11", () => {
			// Test minimum value
			jest.spyOn(Math, "random").mockReturnValue(0);
			let result = getRandomGenerationParams();
			expect(result.height).toBe(2);

			// Test maximum value
			jest.spyOn(Math, "random").mockReturnValue(0.999);
			result = getRandomGenerationParams();
			expect(result.height).toBe(11);
		});

		it("should generate cohesion in range -100 to 59", () => {
			// Test minimum value
			jest.spyOn(Math, "random").mockReturnValue(0);
			let result = getRandomGenerationParams();
			expect(result.cohesion).toBe(-100);

			// Test maximum value
			jest.spyOn(Math, "random").mockReturnValue(0.999);
			result = getRandomGenerationParams();
			expect(result.cohesion).toBe(59);
		});

		it("should generate strength in range 0-100", () => {
			// Test minimum value
			jest.spyOn(Math, "random").mockReturnValue(0);
			let result = getRandomGenerationParams();
			expect(result.strength).toBe(0);

			// Test maximum value
			jest.spyOn(Math, "random").mockReturnValue(0.999);
			result = getRandomGenerationParams();
			expect(result.strength).toBe(100);
		});

		it("should generate density in range 15-64", () => {
			// Test minimum value
			jest.spyOn(Math, "random").mockReturnValue(0);
			let result = getRandomGenerationParams();
			expect(result.density).toBe(15);

			// Test maximum value
			jest.spyOn(Math, "random").mockReturnValue(0.999);
			result = getRandomGenerationParams();
			expect(result.density).toBe(64);
		});
	});

	it("should generate different values on multiple calls", () => {
		// Use real Math.random for this test
		jest.spyOn(Math, "random").mockRestore();

		const results = Array.from({ length: 10 }, () =>
			getRandomGenerationParams(),
		);

		// Check that not all values are identical (very unlikely with real random)
		const allWidthsSame = results.every((r) => r.width === results[0].width);
		const allHeightsSame = results.every((r) => r.height === results[0].height);
		const allCohesionsSame = results.every(
			(r) => r.cohesion === results[0].cohesion,
		);

		expect(allWidthsSame && allHeightsSame && allCohesionsSame).toBe(false);
	});

	it("should return integers for all numeric properties", () => {
		const result = getRandomGenerationParams();

		expect(Number.isInteger(result.width)).toBe(true);
		expect(Number.isInteger(result.height)).toBe(true);
		expect(Number.isInteger(result.cohesion)).toBe(true);
		expect(Number.isInteger(result.strength)).toBe(true);
		expect(Number.isInteger(result.density)).toBe(true);
	});
});
