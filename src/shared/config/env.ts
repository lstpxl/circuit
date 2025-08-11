type PublicEnv = {
	VITE_BASE_URL?: string;
	NODE_ENV?: string;
	DEV?: boolean;
	PROD?: boolean;
};

// Avoid literal import.meta in CJS parsing (tests)
function getImportMeta(): unknown {
	try {
		return Function("return import.meta")();
	} catch {
		return undefined;
	}
}

// Try to access the base URL injected by Vite
declare const __APP_BASE_URL__: string | undefined;

const meta = getImportMeta();
const raw = (meta as { env?: Record<string, unknown> })?.env ?? {};

// Safe snapshot of process.env (undefined in browser/Vite)
const procEnv: Record<string, unknown> =
	typeof process !== "undefined" && process?.env
		? (process.env as Record<string, unknown>)
		: {};

export const ENV: PublicEnv = {
	VITE_BASE_URL:
		typeof raw.VITE_BASE_URL === "string"
			? (raw.VITE_BASE_URL as string)
			: typeof procEnv.VITE_BASE_URL === "string"
				? (procEnv.VITE_BASE_URL as string)
				: "/",
	NODE_ENV:
		typeof raw.NODE_ENV === "string"
			? (raw.NODE_ENV as string)
			: typeof procEnv.NODE_ENV === "string"
				? (procEnv.NODE_ENV as string)
				: "test",
	DEV:
		typeof raw.DEV === "boolean"
			? (raw.DEV as boolean)
			: procEnv.NODE_ENV !== "production",
	PROD:
		typeof raw.PROD === "boolean"
			? (raw.PROD as boolean)
			: procEnv.NODE_ENV === "production",
};

export const getBaseUrl = (): string => {
	// First check if we have the Vite-injected base URL
	if (typeof __APP_BASE_URL__ === "string") {
		return __APP_BASE_URL__.replace(/\/+$/, "") || "/";
	}

	// Fall back to environment variable from ENV
	return (ENV.VITE_BASE_URL || "/").replace(/\/+$/, "") || "/";
};
