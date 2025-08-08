import {
	InvalidCodeError,
	GridCreationError,
	EncodingError,
	ValidationError,
} from "@/model/errors";

export function reportError(error: Error, context?: Record<string, unknown>) {
	const baseContext: Record<string, unknown> = {
		timestamp: new Date().toISOString(),
		userAgent: navigator.userAgent,
		url: window.location.href,
		pathname: window.location.pathname,
		search: window.location.search,
		...context,
	};

	const errorReport: {
		name: string;
		message: string;
		stack?: string;
		context: Record<string, unknown>;
	} = {
		name: error.name,
		message: error.message,
		stack: error.stack,
		context: baseContext,
	};

	// Add specific error context
	if (error instanceof InvalidCodeError) {
		errorReport.context.errorType = "InvalidCode";
		errorReport.context.invalidCode = error.code;
		errorReport.context.expectedFormat = error.expectedFormat;
	} else if (error instanceof GridCreationError) {
		errorReport.context.errorType = "GridCreation";
		errorReport.context.code = error.code;
		errorReport.context.dimensions = error.dimensions;
		errorReport.context.originalError = error.originalError?.message;
	} else if (error instanceof EncodingError) {
		errorReport.context.errorType = "Encoding";
		errorReport.context.operation = error.operation;
		errorReport.context.originalError = error.originalError?.message;
	} else if (error instanceof ValidationError) {
		errorReport.context.errorType = "Validation";
		errorReport.context.field = error.field;
		errorReport.context.value = error.value;
		errorReport.context.constraint = error.constraint;
	}

	// Log locally
	console.error("Error Report:", errorReport);

	if (process.env.NODE_ENV === "production") {
		// Send to monitoring service in production
		// Example: Sentry.captureException(error, { extra: errorReport.context });
	}

	return errorReport;
}
