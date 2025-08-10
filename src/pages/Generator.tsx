import { useEffect, useRef } from "react";
import { createPatternDisplayable } from "../features/pattern-generation/model/Generator";
import { Pattern } from "../features/pattern-display/ui/Pattern";
import { defaultGeneratorParams } from "@/features/pattern-generation/model/defaultGeneratorParams";
import { AuthorCredits } from "@/widgets/AuthorCredits";
import LinkToHome from "@/shared/ui/LinkToHomePage";
import { defaultDrawParams } from "@/features/pattern-display/model/defaultDrawParams";
import { usePatternGenerator } from "@/features/pattern-generation/lib/usePatternGenerator";
import { GenerationForm } from "@/features/pattern-generation";
import { CircuitLogo } from "@/shared/ui/branding";
import {
	CopyCodeButton,
	CopyLinkButton,
	DownloadSVGButton,
} from "@/features/pattern-export";

const patternFactory = createPatternDisplayable(defaultGeneratorParams);

function Generator({ code: urlCode }: { code?: string }) {
	const frameId = useRef<HTMLDivElement>(null);
	const {
		patternData,
		code,
		validationError,
		generateFromParams,
		generateFromCode,
	} = usePatternGenerator(patternFactory);

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
					ref={frameId}
					className="relative border border-neutral-300 dark:border-neutral-700 rounded-lg p-[30px] group bg-neutral-800"
				>
					{validationError && (
						<div className="text-red-500 text-lg">{validationError}</div>
					)}
					{!validationError && (
						<>
							<Pattern data={patternData} drawParams={defaultDrawParams} />
							<div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<CopyCodeButton code={code} />
								<CopyLinkButton code={code} />
								<DownloadSVGButton frameId={frameId} />
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
			<CircuitLogo className="left-8 bottom-4" />
		</div>
	);
}

export default Generator;
