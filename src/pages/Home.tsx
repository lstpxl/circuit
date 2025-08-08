import Art from "@/widgets/HeroSection";
import AuthorCredits from "@/widgets/AuthorCredits";
import Logo from "@/widgets/CircuitLogo";
import { buttonVariants } from "@/shared/ui/buttonVariants";
import { cn } from "@/shared/lib/utils";
import { Link } from "@tanstack/react-router";
import Carousel from "@/features/pattern-display/ui/Carousel";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 h-dvh py-4 w-full relative">
			<Carousel />
			<Link
				to="/generate"
				search={{ code: undefined }}
				className={cn(
					buttonVariants({ variant: "default", size: "xl" }),
					"[&.active]:font-bold",
					"no-underline hover:no-underline hover:border-4 hover:border-offset-4 hover:border-primary/90 border-0 fixed bottom-[60px] z-50",
				)}
			>
				Make your own!
			</Link>
			<Logo className="top-[10vh]" />
			<Art />
			<AuthorCredits />
		</div>
	);
}
