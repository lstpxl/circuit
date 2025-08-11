import { TextEncoder, TextDecoder } from "node:util";
global.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

import "@testing-library/jest-dom";
import "whatwg-fetch";
import { ENV } from "@/shared/config/env";
import RO from "resize-observer-polyfill";

// Expose for debug (narrowed)
declare global {
	var __APP_ENV__:
		| {
				VITE_BASE_URL?: string;
				NODE_ENV?: string;
				DEV?: boolean;
				PROD?: boolean;
		  }
		| undefined;
}
globalThis.__APP_ENV__ = ENV;

process.env.VITE_BASE_URL =
	process.env.VITE_BASE_URL || ENV.VITE_BASE_URL || "/";

// Typed bridge of window APIs onto globalThis
type FetchGlobals = {
	fetch?: typeof fetch;
	Headers?: typeof Headers;
	Request?: typeof Request;
	Response?: typeof Response;
};
const g = globalThis as typeof globalThis & FetchGlobals;

if (typeof g.fetch === "undefined" && typeof window.fetch === "function") {
	g.fetch = window.fetch.bind(window);
}
if (typeof g.Headers === "undefined" && "Headers" in window) {
	g.Headers = window.Headers;
}
if (typeof g.Request === "undefined" && "Request" in window) {
	g.Request = window.Request;
}
if (typeof g.Response === "undefined" && "Response" in window) {
	g.Response = window.Response;
}

// Provide stable location & userAgent
Object.defineProperty(window, "location", {
	value: { href: "http://localhost:3000", pathname: "/", search: "" },
	writable: true,
});

Object.defineProperty(navigator, "userAgent", {
	value: "jest-test-runner",
	writable: true,
});

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
	class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	// @ts-expect-error: sdfsdfsd
	window.ResizeObserver = ResizeObserver;
	global.ResizeObserver = ResizeObserver;
}

if (!("ResizeObserver" in window)) {
	// @ts-expect-error: sdfsdfsd
	window.ResizeObserver = RO;
	global.ResizeObserver = RO;
}
