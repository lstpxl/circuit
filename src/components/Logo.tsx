export default function Logo(props: { className?: string }) {
	const { className = "" } = props;
	return (
		<div className={`fixed z-50 ${className}`}>
			<img
				src={`${import.meta.env.BASE_URL}circuit-large.svg`}
				alt="Circuit Logo"
				className="w-auto h-12 opacity-30"
			/>
			{/* <p className="uppercase text-neutral-700 text-sm tracking-wider">
				One pattern for every need
			</p> */}
		</div>
	);
}
