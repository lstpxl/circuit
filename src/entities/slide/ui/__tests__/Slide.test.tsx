import { render, screen } from "@testing-library/react";

const mockParams = {
	width: 4,
	height: 6,
	cohesion: 12,
	direction: "N",
	strength: 55,
	density: 25,
};
const getRandomGenerationParams = jest.fn(() => mockParams);

jest.mock("@/entities/slide/model/getRandomGenerationParams", () => ({
	getRandomGenerationParams: () => getRandomGenerationParams(),
}));

jest.mock("@/features/pattern-display/ui/Pattern", () => ({
	__esModule: true,
	Pattern: () => <div data-testid="pattern" />,
}));

import { Slide } from "@/entities/slide";

describe("Slide", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("renders frame container for index 0", () => {
		render(<Slide index={0} />);
		expect(getRandomGenerationParams).toHaveBeenCalledTimes(1);
		const root = screen.getByTestId("slide");
		expect(root).toBeInTheDocument();
		expect(root.querySelector("#frame-0")).not.toBeNull();
		expect(screen.getByTestId("pattern")).toBeInTheDocument();
	});

	test("renders distinct frames for indices 0 and 1", () => {
		render(
			<>
				<Slide index={0} />
				<Slide index={1} />
			</>,
		);
		expect(getRandomGenerationParams).toHaveBeenCalledTimes(2);
		expect(document.querySelector("#frame-0")).not.toBeNull();
		expect(document.querySelector("#frame-1")).not.toBeNull();
	});
});
