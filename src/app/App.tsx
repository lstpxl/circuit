import { RouterProvider, createRouter } from "@tanstack/react-router";
import { getBaseUrl } from "@/shared/config/env";

import "./index.css";
import { routeTree } from "./routes";

console.log("App initialized with base URL:", getBaseUrl());

const router = createRouter({
	routeTree,
	basepath: getBaseUrl(),
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default function App() {
	return <RouterProvider router={router} />;
}
