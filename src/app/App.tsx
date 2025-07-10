// import React from "react";
import {
	Outlet,
	RouterProvider,
	createRouter,
	createRoute,
	createRootRoute,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import "../index.css";

import Generator from "@/pages/Generator";
import Home from "@/pages/Home";

const rootRoute = createRootRoute({
	component: () => (
		<>
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: function Index() {
		console.log("Index route loaded");
		console.log("Current location:", window.location.href);
		return <Home />;
	},
});

const generatorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/generate",
	validateSearch: (search: Record<string, unknown>) => {
		return {
			code: search.code as string | undefined,
		};
	},
	component: function GeneratorPage() {
		const { code } = generatorRoute.useSearch();
		return <Generator code={code} />;
	},
});

const routeTree = rootRoute.addChildren([indexRoute, generatorRoute]);

const router = createRouter({
	routeTree,
	basepath: import.meta.env.VITE_BASE_URL || "/",
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default function App() {
	return <RouterProvider router={router} />;
}
