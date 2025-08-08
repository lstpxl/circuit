import { useEffect } from "react";
import { createGrid } from "../features/pattern-generation/model/Generator";
import GenerationForm from "@/features/pattern-generation/ui/GenerationForm";
import type { PatternDisplayData } from "../features/pattern-display/ui/Pattern";
import { Pattern } from "../features/pattern-display/ui/Pattern";
import { defaultGeneratorParams } from "@/model/defaultGeneratorParams.ts";
import AuthorCredits from "@/widgets/AuthorCredits";
import Logo from "@/widgets/CircuitLogo";
import LinkToHome from "@/widgets/LinkToHomePage";
import SmallIconButton from "@/shared/ui/SmallIconButton";
import { defaultDrawParams } from "@/features/pattern-display/model/defaultDrawParams";
import { useClipboard } from "@/features/pattern-export/lib/useClipboard";
import { usePatternGenerator } from "@/features/pattern-generation/lib/usePatternGenerator";

const initialPatternData: PatternDisplayData = {
	width: defaultGeneratorParams.width,
	height: defaultGeneratorParams.height,
	lines: createGrid(defaultGeneratorParams),
};

function CopyCodeButton({ onClick }: { onClick: () => void }) {
	return (
		<SmallIconButton
			onClick={onClick}
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

function CopyLinkButton({ code }: { code: string }) {
	const { copy } = useClipboard();

	const handleCopyLink = async () => {
		try {
			const currentUrl = new URL(window.location.href);
			const baseUrl = import.meta.env.VITE_BASE_URL || "/";
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

function DownloadSVGButton({ onClick }: { onClick: () => void }) {
	return (
		<SmallIconButton
			onClick={onClick}
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

function Generator({ code: urlCode }: { code?: string }) {
	const { copy } = useClipboard();
	const {
		patternData,
		code,
		validationError,
		generateFromParams,
		generateFromCode,
	} = usePatternGenerator(initialPatternData);

	const handleCopyCode = async () => {
		try {
			await copy(code);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	const handleDownloadSVG = () => {
		const frame = document.getElementById("frame");
		const svgElement = frame?.querySelector("svg");
		if (svgElement) {
			const svgData = new XMLSerializer().serializeToString(svgElement);
			const svgBlob = new Blob([svgData], {
				type: "image/svg+xml;charset=utf-8",
			});
			const svgUrl = URL.createObjectURL(svgBlob);
			const downloadLink = document.createElement("a");
			downloadLink.href = svgUrl;
			const hash = code.slice(0, 12);
			downloadLink.download = `circuit-pattern-${hash}.svg`;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			URL.revokeObjectURL(svgUrl);
		}
	};

	useEffect(() => {
		if (urlCode) {
			generateFromCode(urlCode);
		}
	}, [urlCode, generateFromCode]);

	return (
		<div className="dark flex flex-col items-center gap-16">
			<div className="flex flex-col items-center gap-4">
				<div
					id="frame"
					className="relative border border-neutral-300 dark:border-neutral-700 rounded-lg p-[30px] group bg-neutral-800"
				>
					{validationError && (
						<div className="text-red-500 text-lg">{validationError}</div>
					)}
					{!validationError && (
						<>
							<Pattern data={patternData} drawParams={defaultDrawParams} />

							<div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<CopyCodeButton onClick={handleCopyCode} />
								<CopyLinkButton code={code} />
								<DownloadSVGButton onClick={handleDownloadSVG} />
							</div>
						</>
					)}
				</div>
			</div>
			<GenerationForm
				onParamGenerate={generateFromParams}
				onCodeGenerate={generateFromCode}
				initialCode={urlCode}
			/>
			<LinkToHome />
			<AuthorCredits />
			<Logo className="left-8 bottom-4" />
		</div>
	);
}

export default Generator;
