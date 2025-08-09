import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import {
	NoneIcon,
	HorizontalIcon,
	VerticalIcon,
	DiagonalBackslashIcon,
	DiagonalSlashIcon,
	OrthogonalIcon,
	DiagonalIcon,
} from "@/shared/ui/icons/AccentDirIcons";

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
			<ToggleGroupItem value="none" aria-label="Toggle none">
				<NoneIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="horizontal" aria-label="Toggle horizontal">
				<HorizontalIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="vertical" aria-label="Toggle vertical">
				<VerticalIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="diagonal-backslash" aria-label="Toggle backslash">
				<DiagonalBackslashIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="diagonal-slash" aria-label="Toggle slash">
				<DiagonalSlashIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="orthogonal" aria-label="Toggle orthogonal">
				<OrthogonalIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="diagonal" aria-label="Toggle diagonal">
				<DiagonalIcon />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
