import { useState, useCallback } from "react";
import { createGrid } from "@/features/pattern-generation/model/Generator";
import {
	createGridFromCode,
	pattern2code,
} from "@/features/pattern-export/lib/encode";
import {
	InvalidCodeError,
	GridCreationError,
	EncodingError,
} from "@/entities/pattern/model/errors";
import type { GeneratorParams } from "@/features/pattern-generation/model/types";
import type { PatternDisplayable } from "@/entities/pattern";

export function usePatternGenerator(initialPattern: PatternDisplayable) {
	const [patternData, setPatternData] =
		useState<PatternDisplayable>(initialPattern);
	const [code, setCode] = useState<string>(
		pattern2code(initialPattern.lines, {
			width: initialPattern.width,
			height: initialPattern.height,
		}),
	);
	const [validationError, setValidationError] = useState<string | null>(null);

	const generateFromParams = useCallback((params: GeneratorParams) => {
		try {
			const pattern = createGrid(params);
			const newCode = pattern2code(pattern, {
				width: params.width,
				height: params.height,
			});

			setCode(newCode);
			setPatternData({
				width: params.width,
				height: params.height,
				lines: pattern,
			});
			setValidationError(null);
		} catch (error) {
			setValidationError("Failed to generate pattern from parameters");
			console.error("Pattern generation error:", error);
		}
	}, []);

	const generateFromCode = useCallback((newCode: string) => {
		try {
			const { lines, dimensions } = createGridFromCode(newCode);

			setCode(newCode);
			setPatternData({
				width: dimensions.width,
				height: dimensions.height,
				lines,
			});
			setValidationError(null);
		} catch (error) {
			if (process.env.NODE_ENV === "production") {
				reportError(
					error instanceof Error ? error : new Error("Unknown error"),
				);
			}

			if (error instanceof InvalidCodeError) {
				setValidationError(`Invalid code format: ${error.message}`);
			} else if (error instanceof GridCreationError) {
				setValidationError(`Failed to create pattern: ${error.message}`);
			} else if (error instanceof EncodingError) {
				setValidationError(
					`Encoding error during ${error.operation}: ${error.message}`,
				);
			} else {
				setValidationError("An unexpected error occurred");
				console.error("Unexpected error:", error);
			}
		}
	}, []);

	return {
		patternData,
		code,
		validationError,
		generateFromParams,
		generateFromCode,
	};
}
