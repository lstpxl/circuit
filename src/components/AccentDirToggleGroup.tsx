import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type AccentDirToggleGroupProps = {
	value: string;
	onValueChange: (value: string) => void;
};

export default function AccentDirToggleGroup({
	value,
	onValueChange,
}: AccentDirToggleGroupProps) {
	return (
		<ToggleGroup
			variant="outline"
			type="single"
			value={value}
			onValueChange={onValueChange}
		>
			{/* none (dot), horizontal, vertical, up-right, down-right,  */}
			{/* ortogonal (plus-shaped), diagonal (x-shaped) */}
			<ToggleGroupItem value="none" aria-label="Toggle none">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>None</title>
					<circle cx="12" cy="12" r="2" fill="currentColor" />
				</svg>
			</ToggleGroupItem>
			<ToggleGroupItem value="horizontal" aria-label="Toggle horizontal">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Horizontal</title>
					<line x1="3" y1="12" x2="21" y2="12" />
				</svg>
			</ToggleGroupItem>
			<ToggleGroupItem value="vertical" aria-label="Toggle vertical">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Vertical</title>
					<line x1="12" y1="3" x2="12" y2="21" />
				</svg>
			</ToggleGroupItem>
			<ToggleGroupItem value="backslash" aria-label="Toggle backslash">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Backslash</title>
					<line x1="7" y1="7" x2="17" y2="17" />
				</svg>
			</ToggleGroupItem>
			<ToggleGroupItem value="slash" aria-label="Toggle slash">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Slash</title>
					<line x1="7" y1="17" x2="17" y2="7" />
				</svg>
			</ToggleGroupItem>
			<ToggleGroupItem value="orthogonal" aria-label="Toggle orthogonal">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Orthogonal</title>
					<rect x="6" y="6" width="12" height="12" />
				</svg>
			</ToggleGroupItem>
			<ToggleGroupItem value="diagonal" aria-label="Toggle diagonal">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Diagonal</title>
					<line x1="6" y1="6" x2="18" y2="18" />
					<line x1="6" y1="18" x2="18" y2="6" />
				</svg>
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
