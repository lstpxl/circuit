import { useState } from "react";

export default function CodeText({ code }: { code: string }) {
	const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
		"idle",
	);

	const handleClick = async () => {
		if (!navigator.clipboard) {
			setStatus("error");
			return;
		}

		setStatus("copying");
		try {
			await navigator.clipboard.writeText(code);
			setStatus("copied");
			setTimeout(() => setStatus("idle"), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
			setStatus("error");
			setTimeout(() => setStatus("idle"), 2000);
		}
	};

	const getDisplayText = () => {
		switch (status) {
			case "copying":
				return "Copying...";
			case "copied":
				return "Copied!";
			case "error":
				return "Failed to copy";
			default:
				return code;
		}
	};

	return (
		<button
			type="button"
			className={`rounded bg-neutral-800 text-neutral-600 max-w-96 break-all px-2 py-1 text-sm cursor-copy hover:bg-neutral-700 transition-colors ${
				status === "error" ? "text-red-400" : ""
			}`}
			onClick={handleClick}
			title="Click to copy"
		>
			{getDisplayText()}
		</button>
	);
}
