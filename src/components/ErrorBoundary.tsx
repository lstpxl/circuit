import React from "react";

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
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return (
					<FallbackComponent
						error={this.state.error}
						retry={this.handleRetry}
					/>
				);
			}

			return (
				<div className="flex flex-col items-center justify-center p-8 text-center">
					<div className="text-red-500 p-6 border border-red-300 rounded-lg bg-red-50 dark:bg-red-950/20 max-w-md">
						<h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
						<p className="text-sm mb-4">
							There was an error generating the pattern. This might be due to
							invalid code or a technical issue.
						</p>
						<div className="flex gap-2 justify-center">
							<button
								type="button"
								onClick={this.handleRetry}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
							>
								Try Again
							</button>
							<button
								type="button"
								onClick={() => {
									window.location.href = "/";
								}}
								className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
							>
								Go Home
							</button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
