import "@testing-library/jest-dom";

// Mock window.location
Object.defineProperty(window, "location", {
	value: {
		href: "http://localhost:3000",
		pathname: "/",
		search: "",
	},
	writable: true,
});

// Mock navigator
Object.defineProperty(navigator, "userAgent", {
	value: "jest-test-runner",
	writable: true,
});
