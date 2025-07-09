import { Link } from "@tanstack/react-router";

export default function LinkToHome() {
	return (
		<div className="fixed top-4 right-4 z-50 text-neutral-600 text-sm flex items-baseline gap-4 bg-background/50 rounded px-4 py-1">
			<Link to="/">Home</Link>
		</div>
	);
}
