import SmallIconButton from "@/shared/ui/SmallIconButton";
import { useClipboard } from "..";
import { getBaseUrl } from "@/shared/config/env";

export function CopyLinkButton({ code }: { code: string }) {
	const { copy } = useClipboard();

	const handleCopyLink = async () => {
		try {
			const currentUrl = new URL(window.location.href);
			const baseUrl = getBaseUrl();
			const generatePath = baseUrl.endsWith("/")
				? `${baseUrl}generate`
				: `${baseUrl}/generate`;
			const shareableUrl = `${currentUrl.protocol}//${currentUrl.host}${generatePath}?code=${code}`;
			await copy(shareableUrl);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	return (
		<SmallIconButton
			id="copy-link-button"
			onClick={handleCopyLink}
			titleIdle="Copy link"
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
					<title>Copy link</title>
					<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
					<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
				</svg>
			}
		/>
	);
}
