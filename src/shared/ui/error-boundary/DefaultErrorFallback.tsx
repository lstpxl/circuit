export default function DefaultErrorFallback({
	error,
	retry,
}: {
	error?: Error;
	retry: () => void;
}) {
	return (
		<div className="error-boundary">
			<h2>Something went wrong</h2>
			{error && <pre>{error.message}</pre>}
			<button type="button" onClick={retry}>
				Try Again
			</button>
		</div>
	);
}
