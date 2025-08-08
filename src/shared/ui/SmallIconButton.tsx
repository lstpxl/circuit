import { useState } from "react";

interface SmallIconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	icon: React.ReactNode;
	titleIdle?: string;
	titleTriggered?: string;
}

export default function SmallIconButton(props: SmallIconButtonProps) {
	const { onClick, icon, titleIdle, titleTriggered, ...rest } = props;
	const [isTriggered, setIsTriggered] = useState(false);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setIsTriggered(true);
		setTimeout(() => setIsTriggered(false), 300);
		onClick();
	};

	return (
		<button
			type="button"
			title={
				isTriggered ? titleTriggered || "Triggered!" : titleIdle || "Click me"
			}
			onClick={handleClick}
			className={`bg-black/70 hover:bg-black/90 text-white p-2 rounded-md transition-all cursor-pointer hover:outline-1 hover:outline-white/50 ${
				isTriggered ? "scale-80" : "scale-100"
			}`}
			{...rest}
		>
			{icon}
		</button>
	);
}
