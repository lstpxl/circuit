import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current directory
	const env = loadEnv(mode, process.cwd());

	// Determine base URL based on environment
	// Use VITE_BASE_URL directly, defaulting to "/" if not provided
	const baseUrl = env.VITE_BASE_URL || "/";

	return {
		base: baseUrl,
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		define: {
			// Make base URL available to client-side code
			__APP_BASE_URL__: JSON.stringify(baseUrl),
		},
	};
});
