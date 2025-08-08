import React from "react";
import {
	InvalidCodeError,
	GridCreationError,
} from "@/entities/pattern/model/errors";
import DefaultErrorFallback from "./DefaultErrorFallback";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.state.error instanceof InvalidCodeError) {
				return (
					<div className="error-boundary">
						<h2>Invalid Pattern Code</h2>
						<p>The pattern code you entered is not valid.</p>
						<details>
							<summary>Expected format</summary>
							<code>{this.state.error.expectedFormat}</code>
						</details>
						<button
							type="button"
							onClick={() => this.setState({ hasError: false })}
						>
							Try Again
						</button>
					</div>
				);
			}

			if (this.state.error instanceof GridCreationError) {
				return (
					<div className="error-boundary">
						<h2>Pattern Generation Failed</h2>
						<p>Unable to create pattern from the provided code.</p>
						{this.state.error.dimensions && (
							<p>
								Dimensions: {this.state.error.dimensions.width}×
								{this.state.error.dimensions.height}
							</p>
						)}
						<button
							type="button"
							onClick={() => this.setState({ hasError: false })}
						>
							Try Again
						</button>
					</div>
				);
			}

			// Generic fallback
			const Fallback = this.props.fallback ?? DefaultErrorFallback;
			return <Fallback error={this.state.error} retry={this.handleRetry} />;
		}

		return this.props.children;
	}
}
