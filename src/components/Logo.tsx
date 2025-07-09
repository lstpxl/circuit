export default function Logo() {
	return (
		<div className="fixed top-4 left-4 z-50">
			<img
				src="/circuit-large.svg"
				alt="Circuit Logo"
				className="w-auto h-12 opacity-30"
			/>
			<p className="uppercase text-neutral-700 text-sm tracking-wider">
				One pattern for every need
			</p>
		</div>
	);
}
