import { render, screen } from "@testing-library/react";
import {
	createRouter,
	createMemoryHistory,
	RouterProvider,
	type AnyRoute,
} from "@tanstack/react-router";

// Mock BEFORE importing routeTree
jest.mock("@/pages/Home", () => ({
	__esModule: true,
	default: () => (
		<div>
			<a href="/generate">Make your own!</a>
		</div>
	),
}));

jest.mock("@/pages/Generator", () => ({
	__esModule: true,
	default: ({ code }: { code?: string }) => (
		<div data-testid="generator" data-code={code || ""}>
			GeneratorMock
		</div>
	),
}));

let routeTree: unknown;

beforeAll(async () => {
	const routesModule = await import("../routes");
	routeTree = routesModule.routeTree;
});

describe("App / routing", () => {
	test("renders home route by default", async () => {
		const history = createMemoryHistory({ initialEntries: ["/"] });
		const router = createRouter({
			routeTree: routeTree as AnyRoute,
			history,
			// @ts-expect-error: unknown
			viewTransition: (cb: () => void) => cb(),
		});
		render(<RouterProvider router={router} />);
		const homeCta = await screen.findByRole("link", { name: /make your own/i });
		expect(homeCta).toBeInTheDocument();
	});
});
