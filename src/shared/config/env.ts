type PublicEnv = {
	VITE_BASE_URL?: string;
	NODE_ENV?: string;
	DEV?: boolean;
	PROD?: boolean;
};

// Safe dynamic access that avoids a literal `import.meta` in parsed code
function getImportMeta(): unknown | undefined {
	try {
		// Using Function to avoid parse-time syntax error in CJS
		// sd eslint-disable-next-line no-new-func
		return Function("return import.meta")();
	} catch {
		return undefined;
	}
}

const meta = getImportMeta();
const raw = (meta as { env?: Record<string, unknown> })?.env ?? {};

export const ENV: PublicEnv = {
	VITE_BASE_URL:
		typeof raw.VITE_BASE_URL === "string"
			? raw.VITE_BASE_URL
			: typeof process.env.VITE_BASE_URL === "string"
				? process.env.VITE_BASE_URL
				: "/",
	NODE_ENV:
		typeof raw.NODE_ENV === "string"
			? raw.NODE_ENV
			: typeof process.env.NODE_ENV === "string"
				? process.env.NODE_ENV
				: "test",
	DEV:
		typeof raw.DEV === "boolean"
			? raw.DEV
			: process.env.NODE_ENV !== "production",
	PROD:
		typeof raw.PROD === "boolean"
			? raw.PROD
			: process.env.NODE_ENV === "production",
};

export const getBaseUrl = () =>
	(ENV.VITE_BASE_URL || "/").replace(/\/+$/, "") || "/";
