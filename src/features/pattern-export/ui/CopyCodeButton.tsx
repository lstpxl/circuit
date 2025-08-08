import SmallIconButton from "@/shared/ui/SmallIconButton";
import { useClipboard } from "..";

export function CopyCodeButton({ code }: { code: string }) {
	const { copy } = useClipboard();

	const handleClick = async () => {
		try {
			await copy(code);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	return (
		<SmallIconButton
			onClick={handleClick}
			titleIdle="Copy code"
			titleTriggered="Copied!"
			icon={
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Copy code</title>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			}
		/>
	);
}
