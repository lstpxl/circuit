import { APP_CONFIG } from "@/shared/config/constants";
import SmallIconButton from "@/shared/ui/SmallIconButton";

export function DownloadSVGButton({
	frameId,
}: { frameId: React.RefObject<HTMLDivElement | null> }) {
	const handleDownloadSVG = () => {
		if (!frameId.current) return;
		const frame = frameId.current;
		const svgElement = frame.querySelector("svg");
		if (svgElement) {
			const svgData = new XMLSerializer().serializeToString(svgElement);
			const svgBlob = new Blob([svgData], {
				type: "image/svg+xml;charset=utf-8",
			});
			const svgUrl = URL.createObjectURL(svgBlob);
			const downloadLink = document.createElement("a");
			downloadLink.href = svgUrl;
			// const hash = code.slice(0, 12);
			const filename = `${APP_CONFIG.defaultFilename}${Date.now()}.svg`;
			downloadLink.download = filename;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			URL.revokeObjectURL(svgUrl);
		}
	};

	return (
		<SmallIconButton
			onClick={handleDownloadSVG}
			titleIdle="Download SVG"
			titleTriggered="Downloaded!"
			icon={
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Download SVG</title>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7,10 12,15 17,10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
			}
		/>
	);
}
