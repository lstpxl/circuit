import { createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import Generator from "@/pages/Generator";
import Home from "@/pages/Home";
import { ErrorBoundary } from "@/shared/ui/error-boundary/ErrorBoundary";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const rootRoute = createRootRoute({
	component: () => (
		<ErrorBoundary>
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</ErrorBoundary>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: function Index() {
		return <Home />;
	},
});

const generatorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/generate",
	validateSearch: (search: Record<string, unknown> = {}) => {
		return {
			code: typeof search.code === "string" ? search.code : undefined,
		};
	},
	component: function GeneratorPage() {
		const { code } = generatorRoute.useSearch();
		return (
			<ErrorBoundary>
				<Generator code={code} />
			</ErrorBoundary>
		);
	},
});

export const routeTree = rootRoute.addChildren([indexRoute, generatorRoute]);
