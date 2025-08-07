import Art from "@/components/Art";
import AuthorCredits from "@/components/AuthorCredits";
import Carousel from "@/components/Carousel";
import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { cn } from "@/lib/utils.ts";
import { Link } from "@tanstack/react-router";

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
