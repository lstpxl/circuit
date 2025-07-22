import { useState } from "react";

export default function CodeText({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	const handleClick = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 1000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<div
			className="rounded bg-neutral-800 text-neutral-600 max-w-96 break-all px-2 py-1 text-sm cursor-copy hover:bg-neutral-700 transition-colors"
			onClick={handleClick}
			onKeyDown={handleClick}
			title="Click to copy"
		>
			{copied ? "Copied!" : code}
		</div>
	);
}
