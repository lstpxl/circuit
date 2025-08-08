import { useState, useCallback } from "react";

export function useClipboard() {
	const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
		"idle",
	);

	const copy = useCallback(async (text: string) => {
		if (!navigator.clipboard) {
			setStatus("error");
			return false;
		}

		setStatus("copying");
		try {
			await navigator.clipboard.writeText(text);
			setStatus("copied");
			return true;
		} catch (err) {
			console.error("Failed to copy:", err);
			setStatus("error");
			return false;
		}
	}, []);

	return { copy, status };
}
