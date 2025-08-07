export class InvalidCodeError extends Error {
	public code: string;
	public expectedFormat?: string;

	constructor(message: string, code: string, expectedFormat?: string) {
		super(message);
		this.name = "InvalidCodeError";
		this.code = code;
		this.expectedFormat = expectedFormat;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidCodeError);
		}
	}
}

export class GridCreationError extends Error {
	public code?: string;
	public dimensions?: { width: number; height: number };
	public originalError?: Error;

	constructor(
		message: string,
		code?: string,
		dimensions?: { width: number; height: number },
		originalError?: Error,
	) {
		super(message);
		this.name = "GridCreationError";
		this.code = code;
		this.dimensions = dimensions;
		this.originalError = originalError;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, GridCreationError);
		}
	}
}

type EncodingOperation = "serialize" | "deserialize" | "encode" | "decode";

export class EncodingError extends Error {
	public operation: EncodingOperation;
	public originalError?: Error;

	constructor(
		message: string,
		operation: EncodingOperation,
		originalError?: Error,
	) {
		super(message);
		this.name = "EncodingError";
		this.operation = operation;
		this.originalError = originalError;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, EncodingError);
		}
	}
}

export class ValidationError extends Error {
	public field: string;
	public value: unknown;
	public constraint?: string;

	constructor(
		message: string,
		field: string,
		value: unknown,
		constraint?: string,
	) {
		super(message);
		this.name = "ValidationError";
		this.field = field;
		this.value = value;
		this.constraint = constraint;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ValidationError);
		}
	}
}
