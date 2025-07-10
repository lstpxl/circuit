import { useEffect, useState } from "react";

import type { GeneratorParams } from "../model/GeneratorParams.d.ts";
import { createGrid } from "../model/Generator";
import GenerationForm from "../components/GenerationForm";
import { validateCode } from "../model/codeValidator";
import type { PatternDisplayData } from "../components/Pattern";
import Pattern from "../components/Pattern";
import { defaultGeneratorParams } from "@/model/defaultGeneratorParams.ts";
import { createGridFromCode, pattern2code } from "@/model/encode.ts";
import AuthorCredits from "@/components/AuthorCredits.tsx";
import Logo from "@/components/Logo.tsx";
import LinkToHome from "@/components/LinkToHome.tsx";

const drawParams = {
	cellSize: 30,
	strokeWidth: 4,
	stroke: { color: "#f06", width: 4, linecap: "round" },
};

const initialPatternData: PatternDisplayData = {
	width: defaultGeneratorParams.width,
	height: defaultGeneratorParams.height,
	lines: createGrid(defaultGeneratorParams),
};

function SmallIconButton({
	onClick,
	icon,
	...rest
}: {
	onClick: () => void;
	icon: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-md transition-colors cursor-pointer"
			{...rest}
		>
			{icon}
		</button>
	);
}

function CopyCodeButton({ onClick }: { onClick: () => void }) {
	return (
		<SmallIconButton
			id="copy-code-button"
			onClick={onClick}
			title="Copy code"
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
	const handleCopyLink = async () => {
		try {
			const currentUrl = new URL(window.location.href);
			const baseUrl = import.meta.env.VITE_BASE_URL || "/";
			const generatePath = baseUrl.endsWith("/")
				? `${baseUrl}generate`
				: `${baseUrl}/generate`;
			const shareableUrl = `${currentUrl.protocol}//${currentUrl.host}${generatePath}?code=${code}`;
			await navigator.clipboard.writeText(shareableUrl);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
		const button = document.getElementById("copy-link-button");
		if (button) {
			button.style.opacity = "0";
			setTimeout(() => {
				button.style.opacity = "100%";
			}, 1000);
		}
	};

	return (
		<SmallIconButton
			id="copy-link-button"
			onClick={handleCopyLink}
			title="Copy link"
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
			id="download-svg-button"
			onClick={onClick}
			title="Download SVG"
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
	const [patternData, setPatternData] =
		useState<PatternDisplayData>(initialPatternData);
	const [code, setCode] = useState<string>(
		pattern2code(initialPatternData.lines, {
			width: initialPatternData.width,
			height: initialPatternData.height,
		}),
	);
	const [validationError, setValidationError] = useState<string | null>(null);

	const handleGenerateFromParams = (params: GeneratorParams) => {
		const pattern = createGrid(params);
		setCode(
			pattern2code(pattern, {
				width: params.width,
				height: params.height,
			}),
		);
		setPatternData({
			width: params.width,
			height: params.height,
			lines: pattern,
		});
	};

	const handleGenerateFromCode = (newCode: string) => {
		setCode(newCode);
		const pattern = createGridFromCode(newCode);
		const { width, height } = validateCode(newCode) || { width: 1 };
		setPatternData({
			width: width,
			height: height || 1,
			lines: pattern,
		});
	};

	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(code);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
		const button = document.getElementById("copy-code-button");
		if (button) {
			button.style.opacity = "0";
			setTimeout(() => {
				button.style.opacity = "100%";
			}, 1000);
		}
	};

	const handleDownloadSVG = () => {
		const svgElement = document.querySelector("#frame svg");
		if (svgElement) {
			const svgData = new XMLSerializer().serializeToString(svgElement);
			const svgBlob = new Blob([svgData], {
				type: "image/svg+xml;charset=utf-8",
			});
			const svgUrl = URL.createObjectURL(svgBlob);
			const downloadLink = document.createElement("a");
			downloadLink.href = svgUrl;
			downloadLink.download = "circuit-pattern.svg";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			URL.revokeObjectURL(svgUrl);
		}
		const button = document.getElementById("download-svg-button");
		if (button) {
			button.style.opacity = "0";
			setTimeout(() => {
				button.style.opacity = "100%";
			}, 1000);
		}
	};

	useEffect(() => {
		if (urlCode) {
			const validated = validateCode(urlCode);
			if (!validated) {
				console.error("Invalid code format:", urlCode);
				setValidationError("Invalid code");
				return;
			}
			const { width, height } = validated || {
				width: 1,
				height: 1,
				expectedLength: 6,
				binary: "0".repeat(6),
			};
			const pattern = createGridFromCode(urlCode);
			setPatternData({
				width: width,
				height: height || 1,
				lines: pattern,
			});
			setCode(urlCode);
		} else {
			setValidationError(null);
		}
	}, [urlCode]);

	return (
		<div className="dark flex flex-col items-center gap-16">
			<div className="flex flex-col items-center gap-4">
				<div
					id="frame"
					className="relative border border-neutral-300 dark:border-neutral-700 rounded-lg p-[30px] group"
				>
					{validationError && (
						<div className="text-red-500 text-lg">{validationError}</div>
					)}
					{!validationError && (
						<>
							<Pattern data={patternData} drawParams={drawParams} />

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
				onParamGenerate={handleGenerateFromParams}
				onCodeGenerate={handleGenerateFromCode}
				initialCode={urlCode}
			/>
			<LinkToHome />
			<AuthorCredits />
			<Logo className="left-4" />
		</div>
	);
}

export default Generator;
