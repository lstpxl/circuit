import { render, screen } from "@testing-library/react";
import { Carousel } from "../Carousel";

// Mock the Slide component
jest.mock("@/entities/slide/ui/Slide", () => ({
	Slide: ({ index, style }: { index: number; style: React.CSSProperties }) => (
		<div data-testid={`slide-${index}`} style={style}>
			Slide {index}
		</div>
	),
}));

describe("Carousel", () => {
	test("renders carousel container with proper structure", () => {
		const { container } = render(<Carousel />);

		const outerContainer = container.firstChild as HTMLElement;
		const innerContainer = outerContainer.firstChild as HTMLElement;

		expect(outerContainer).toHaveClass("w-full", "h-svh");
		expect(innerContainer).toHaveClass(
			"flex",
			"gap-4",
			"overflow-hidden",
			"relative",
			"h-svh",
		);
	});

	test("renders 14 slides with correct indices", () => {
		render(<Carousel />);

		for (let i = 0; i < 14; i++) {
			expect(screen.getByTestId(`slide-${i}`)).toBeInTheDocument();
		}
	});

	test("applies initial positioning styles to slides", () => {
		render(<Carousel />);

		const slide0 = screen.getByTestId("slide-0");
		expect(slide0).toHaveStyle({
			position: "absolute",
			transform: "translate3d(0px, 0px, 0)",
		});
	});

	test("initializes with empty coordinates and dimensions", () => {
		render(<Carousel />);

		const slides = screen.getAllByTestId(/slide-\d+/);
		for (const slide of slides) {
			expect(slide).toHaveStyle("transform: translate3d(0px, 0px, 0)");
		}
	});

	test("properly sets container reference", () => {
		const { container } = render(<Carousel />);
		const carouselContainer = container.querySelector(".flex");

		expect(carouselContainer).toBeInTheDocument();
	});

	test("maintains slide count throughout component lifecycle", () => {
		render(<Carousel />);

		const slides = screen.getAllByTestId(/slide-\d+/);
		expect(slides).toHaveLength(14);
	});

	test("renders slides with absolute positioning", () => {
		render(<Carousel />);

		const slides = screen.getAllByTestId(/slide-\d+/);
		for (const slide of slides) {
			expect(slide).toHaveStyle("position: absolute");
		}
	});

	test("applies transform styles to all slides", () => {
		render(<Carousel />);

		const slides = screen.getAllByTestId(/slide-\d+/);
		for (const slide of slides) {
			const transform = slide.style.transform;
			expect(transform).toMatch(/translate3d\(\d+px, \d+px, 0\)/);
		}
	});
});
