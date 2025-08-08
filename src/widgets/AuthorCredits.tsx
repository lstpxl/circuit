import { GithubLogo } from "../shared/ui/branding/GithubLogo";

export function AuthorCredits() {
	return (
		<div className="fixed bottom-4 right-4 z-50 text-neutral-600 text-sm flex items-baseline gap-4 bg-background/50 rounded px-4 py-1">
			<span>&copy; 2025 Ilia Pavlov</span>
			<a
				href="https://github.com/lstpxl/circuit"
				className="inline-flex items-baseline gap-1 hover:text-primary"
			>
				<GithubLogo />
				GitHub repository
			</a>
		</div>
	);
}
