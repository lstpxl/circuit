import { render, screen } from "@testing-library/react";
import { Pattern } from "../Pattern";
import type { PatternDisplayable } from "@/entities/pattern";
import type { DrawParams } from "../../model/types";

// Mock SVG.js
const mockLine = jest.fn().mockReturnThis();
const mockStroke = jest.fn().mockReturnThis();
const mockDmove = jest.fn().mockReturnThis();
const mockSize = jest.fn().mockReturnThis();
const mockAddTo = jest.fn().mockReturnThis();
const mockRemove = jest.fn();

jest.mock("@svgdotjs/svg.js", () => ({
	SVG: jest.fn(() => ({
		size: mockSize,
		addTo: mockAddTo,
		line: mockLine,
		stroke: mockStroke,
		dmove: mockDmove,
		remove: mockRemove,
	})),
}));

// Mock useId
let idCounter = 0;
jest.mock("react", () => ({
	...jest.requireActual("react"),
	useId: () => `test-id-${++idCounter}`,
}));

// Get reference to the mocked SVG function for testing
const { SVG: mockSVG } = jest.requireMock("@svgdotjs/svg.js");

describe("Pattern", () => {
	const mockDrawParams: DrawParams = {
		cellSize: 10,
		strokeWidth: 2,
		stroke: { color: "#000000", width: 2, linecap: "round" },
	};

	const mockPatternData: PatternDisplayable = {
		width: 3,
		height: 3,
		lines: [
			{ x: 0, y: 0, dir: "r", status: true },
			{ x: 1, y: 0, dir: "d", status: true },
			{ x: 0, y: 1, dir: "a", status: false },
			{ x: 1, y: 1, dir: "e", status: true },
		],
	};

	beforeEach(() => {
		jest.clearAllMocks();
		idCounter = 0;

		// Reset the mock chain
		mockLine.mockReturnThis();
		mockStroke.mockReturnThis();
		mockDmove.mockReturnThis();
		mockSize.mockReturnThis();
		mockAddTo.mockReturnThis();
	});

	test("renders pattern container with correct dimensions", () => {
		render(<Pattern data={mockPatternData} drawParams={mockDrawParams} />);

		const expectedWidth =
			mockPatternData.width * mockDrawParams.cellSize +
			mockDrawParams.strokeWidth;
		const expectedHeight =
			mockPatternData.height * mockDrawParams.cellSize +
			mockDrawParams.strokeWidth;

		const container = screen.getByTestId("pattern-test-id-1");
		expect(container).toHaveStyle({
			width: `${expectedWidth}px`,
			height: `${expectedHeight}px`,
			overflow: "hidden",
		});
		expect(container).toHaveClass("box-content");
	});

	test("creates SVG with correct dimensions", () => {
		render(<Pattern data={mockPatternData} drawParams={mockDrawParams} />);

		const expectedWidth =
			mockPatternData.width * mockDrawParams.cellSize +
			mockDrawParams.strokeWidth;
		const expectedHeight =
			mockPatternData.height * mockDrawParams.cellSize +
			mockDrawParams.strokeWidth;

		expect(mockSVG).toHaveBeenCalled();
		expect(mockSize).toHaveBeenCalledWith(expectedWidth, expectedHeight);
		expect(mockAddTo).toHaveBeenCalledWith("#pattern-test-id-1");
	});

	test("draws lines for active pattern elements", () => {
		render(<Pattern data={mockPatternData} drawParams={mockDrawParams} />);

		// Should draw 3 lines (only those with status: true)
		const activeLines = mockPatternData.lines.filter((line) => line.status);
		expect(mockLine).toHaveBeenCalledTimes(activeLines.length);
		expect(mockStroke).toHaveBeenCalledTimes(activeLines.length);
		expect(mockDmove).toHaveBeenCalledTimes(activeLines.length);
	});

	test("draws right direction line correctly", () => {
		const singleLineData: PatternDisplayable = {
			width: 2,
			height: 1,
			lines: [{ x: 0, y: 0, dir: "r", status: true }],
		};

		render(<Pattern data={singleLineData} drawParams={mockDrawParams} />);

		expect(mockLine).toHaveBeenCalledWith(0, 0, 10, 0);
		expect(mockStroke).toHaveBeenCalledWith(mockDrawParams.stroke);
		expect(mockDmove).toHaveBeenCalledWith(1, 1);
	});

	test("draws down direction line correctly", () => {
		const singleLineData: PatternDisplayable = {
			width: 1,
			height: 2,
			lines: [{ x: 0, y: 0, dir: "d", status: true }],
		};

		render(<Pattern data={singleLineData} drawParams={mockDrawParams} />);

		expect(mockLine).toHaveBeenCalledWith(0, 0, 0, 10);
	});

	test("draws ascending diagonal line correctly", () => {
		const singleLineData: PatternDisplayable = {
			width: 2,
			height: 2,
			lines: [{ x: 0, y: 1, dir: "a", status: true }],
		};

		render(<Pattern data={singleLineData} drawParams={mockDrawParams} />);

		expect(mockLine).toHaveBeenCalledWith(0, 10, 10, 0);
	});

	test("draws descending diagonal line correctly", () => {
		const singleLineData: PatternDisplayable = {
			width: 2,
			height: 2,
			lines: [{ x: 0, y: 0, dir: "e", status: true }],
		};

		render(<Pattern data={singleLineData} drawParams={mockDrawParams} />);

		expect(mockLine).toHaveBeenCalledWith(0, 0, 10, 10);
	});

	test("skips lines with status false", () => {
		const mixedStatusData: PatternDisplayable = {
			width: 2,
			height: 1,
			lines: [
				{ x: 0, y: 0, dir: "r", status: true },
				{ x: 1, y: 0, dir: "r", status: false },
			],
		};

		render(<Pattern data={mixedStatusData} drawParams={mockDrawParams} />);

		expect(mockLine).toHaveBeenCalledTimes(1);
	});

	test("cleans up SVG on unmount", () => {
		const { unmount } = render(
			<Pattern data={mockPatternData} drawParams={mockDrawParams} />,
		);

		unmount();

		expect(mockRemove).toHaveBeenCalled();
	});

	test("recreates SVG when data changes", () => {
		const { rerender } = render(
			<Pattern data={mockPatternData} drawParams={mockDrawParams} />,
		);

		const newPatternData: PatternDisplayable = {
			width: 2,
			height: 2,
			lines: [{ x: 0, y: 0, dir: "r", status: true }],
		};

		rerender(<Pattern data={newPatternData} drawParams={mockDrawParams} />);

		// Should have called SVG constructor twice (initial + rerender)
		expect(mockSVG).toHaveBeenCalledTimes(2);
		expect(mockRemove).toHaveBeenCalledTimes(1);
	});

	test("recreates SVG when drawParams change", () => {
		const { rerender } = render(
			<Pattern data={mockPatternData} drawParams={mockDrawParams} />,
		);

		const newDrawParams: DrawParams = {
			cellSize: 20,
			strokeWidth: 4,
			stroke: { color: "#ff0000", width: 4, linecap: "round" },
		};

		rerender(<Pattern data={mockPatternData} drawParams={newDrawParams} />);

		expect(mockSVG).toHaveBeenCalledTimes(2);
	});

	test("generates unique container ID", () => {
		const { container: container1 } = render(
			<Pattern data={mockPatternData} drawParams={mockDrawParams} />,
		);
		const { container: container2 } = render(
			<Pattern data={mockPatternData} drawParams={mockDrawParams} />,
		);

		const div1 = container1.querySelector("div[id^='pattern-']");
		const div2 = container2.querySelector("div[id^='pattern-']");

		expect(div1?.id).toBe("pattern-test-id-1");
		expect(div2?.id).toBe("pattern-test-id-2");
		expect(div1?.id).not.toBe(div2?.id);
	});

	test("clears container innerHTML before creating new SVG", () => {
		const mockInnerHTML = jest.fn();
		const mockGetElementById = jest.spyOn(document, "getElementById");

		mockGetElementById.mockReturnValue({
			set innerHTML(value: string) {
				mockInnerHTML(value);
			},
			get innerHTML() {
				return "";
			},
		} as HTMLElement);

		render(<Pattern data={mockPatternData} drawParams={mockDrawParams} />);

		expect(mockInnerHTML).toHaveBeenCalledWith("");

		mockGetElementById.mockRestore();
	});
});
