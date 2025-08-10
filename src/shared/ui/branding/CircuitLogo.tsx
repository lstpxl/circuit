import { getBaseUrl } from "@/shared/config/env";

export function CircuitLogo(props: { className?: string }) {
	const { className = "" } = props;
	return (
		<div className={`fixed z-50 ${className}`}>
			<img
				src={`${getBaseUrl()}circuit-large.svg`}
				alt="Circuit Logo"
				className="w-auto h-12 opacity-30"
			/>
			{/* <p className="uppercase text-neutral-700 text-sm tracking-wider">
				One pattern for every need
			</p> */}
		</div>
	);
}
