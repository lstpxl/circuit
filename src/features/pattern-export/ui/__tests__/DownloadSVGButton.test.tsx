/**
 * @jest-environment jsdom
 */
import type React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DownloadSVGButton } from "../DownloadSVGButton";

// Mock SmallIconButton to avoid complex component interactions
jest.mock("@/shared/ui/SmallIconButton", () => {
	type SmallIconButtonProps = {
		onClick: React.MouseEventHandler<HTMLButtonElement>;
		titleIdle: string;
		titleTriggered: string;
		icon: React.ReactNode;
	};
	return {
		__esModule: true,
		default: function SmallIconButton({
			onClick,
			titleIdle,
			titleTriggered,
			icon,
		}: SmallIconButtonProps) {
			return (
				<button
					type="button"
					onClick={onClick}
					title={titleIdle}
					data-title-alt={titleTriggered}
					data-testid="download-button"
				>
					{icon}
				</button>
			);
		},
	};
});

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-blob-url");
global.URL.revokeObjectURL = jest.fn();

// Mock XMLSerializer
global.XMLSerializer = jest.fn().mockImplementation(() => ({
	serializeToString: jest.fn(
		() => '<svg><rect width="100" height="100"/></svg>',
	),
}));

describe("DownloadSVGButton", () => {
	let mockFrameRef: React.RefObject<HTMLDivElement | null>;
	let mockSvgElement: Partial<SVGSVGElement>;
	// let mockAppendChild: jest.SpyInstance;
	// let mockRemoveChild: jest.SpyInstance;
	let mockCreateElement: jest.SpyInstance;

	// Mock link element
	const mockLink = {
		href: "",
		download: "",
		click: jest.fn(),
		style: {} as CSSStyleDeclaration,
	} as unknown as HTMLAnchorElement;

	beforeAll(() => {
		// Create mock SVG element
		mockSvgElement = {
			tagName: "svg",
		};

		// Create mock frame div
		const mockFrameDiv = {
			querySelector: jest.fn().mockReturnValue(mockSvgElement),
		} as unknown as HTMLDivElement;

		// Create ref
		mockFrameRef = {
			current: mockFrameDiv,
		} as React.RefObject<HTMLDivElement | null>;
	});

	beforeEach(() => {
		// Reset mock link properties
		mockLink.href = "";
		mockLink.download = "";
		jest.clearAllMocks();

		// Keep a reference to the original function
		const originalCreateElement = document.createElement;

		// Setup DOM mocks
		mockCreateElement = jest
			.spyOn(document, "createElement")
			.mockImplementation((tagName: string) => {
				if (tagName === "a") {
					return mockLink;
				}
				// For other elements, call the original implementation
				return originalCreateElement.call(document, tagName);
			});

		// Reset frame ref querySelector mock
		if (mockFrameRef.current) {
			(mockFrameRef.current.querySelector as jest.Mock).mockReturnValue(
				mockSvgElement,
			);
		}
	});

	afterEach(() => {
		// Only restore the specific mocks we created
		mockCreateElement.mockRestore();
	});

	it("should render with download icon and default title", () => {
		render(<DownloadSVGButton frameId={mockFrameRef} />);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("title", "Download SVG");
	});

	it("should serialize SVG and trigger download when clicked", () => {
		render(<DownloadSVGButton frameId={mockFrameRef} />);

		const mockAppendChild = jest
			.spyOn(document.body, "appendChild")
			.mockImplementation(() => mockLink);
		const mockRemoveChild = jest
			.spyOn(document.body, "removeChild")
			.mockImplementation(() => mockLink);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Check that querySelector was called to find SVG
		expect(mockFrameRef.current?.querySelector).toHaveBeenCalledWith("svg");

		// Check that XMLSerializer was used
		expect(XMLSerializer).toHaveBeenCalled();

		// Check that a blob URL was created
		expect(global.URL.createObjectURL).toHaveBeenCalled();

		// Check that download link was created and configured
		expect(document.createElement).toHaveBeenCalledWith("a");
		expect(mockLink.href).toBe("mock-blob-url");
		expect(mockLink.download).toMatch(/circuit-pattern-\d+\.svg/);

		// Check DOM manipulation
		expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
		expect(mockLink.click).toHaveBeenCalled();
		expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
		expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-blob-url");

		mockAppendChild.mockRestore();
		mockRemoveChild.mockRestore();
	});

	it("should handle case when frameId.current is null", () => {
		const nullFrameRef = { current: null };

		render(<DownloadSVGButton frameId={nullFrameRef} />);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Should not attempt to create download
		expect(document.createElement).not.toHaveBeenCalledWith("a");
		expect(mockLink.click).not.toHaveBeenCalled();
	});

	it("should handle case when no SVG element is found", () => {
		const frameWithoutSvg = {
			querySelector: jest.fn().mockReturnValue(null),
		};

		const frameRefWithoutSvg: React.RefObject<HTMLDivElement> = {
			current: frameWithoutSvg as unknown as HTMLDivElement,
		};

		render(<DownloadSVGButton frameId={frameRefWithoutSvg} />);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Should call querySelector but not proceed with download
		expect(frameWithoutSvg.querySelector).toHaveBeenCalledWith("svg");
		expect(XMLSerializer).not.toHaveBeenCalled();
		expect(mockLink.click).not.toHaveBeenCalled();
	});

	it("should create blob with correct MIME type", () => {
		const originalBlob = global.Blob;
		const mockBlob = jest.fn() as unknown as typeof Blob;
		global.Blob = mockBlob;

		render(<DownloadSVGButton frameId={mockFrameRef} />);

		const mockAppendChild = jest
			.spyOn(document.body, "appendChild")
			.mockImplementation();
		const mockRemoveChild = jest
			.spyOn(document.body, "removeChild")
			.mockImplementation();

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(mockBlob).toHaveBeenCalledWith(
			['<svg><rect width="100" height="100"/></svg>'],
			{ type: "image/svg+xml;charset=utf-8" },
		);

		global.Blob = originalBlob;
		mockAppendChild.mockRestore();
		mockRemoveChild.mockRestore();
	});

	it("should generate filename with timestamp", () => {
		const mockTimestamp = 1672531200000;
		const originalDateNow = Date.now;
		Date.now = jest.fn(() => mockTimestamp);

		render(<DownloadSVGButton frameId={mockFrameRef} />);

		const mockAppendChild = jest
			.spyOn(document.body, "appendChild")
			.mockImplementation();
		const mockRemoveChild = jest
			.spyOn(document.body, "removeChild")
			.mockImplementation();

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(mockLink.download).toBe(`circuit-pattern-${mockTimestamp}.svg`);

		Date.now = originalDateNow;
		mockAppendChild.mockRestore();
		mockRemoveChild.mockRestore();
	});

	it("should clean up properly after download", () => {
		render(<DownloadSVGButton frameId={mockFrameRef} />);

		const mockAppendChild = jest
			.spyOn(document.body, "appendChild")
			.mockImplementation(() => mockLink);
		const mockRemoveChild = jest
			.spyOn(document.body, "removeChild")
			.mockImplementation(() => mockLink);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Verify cleanup sequence
		expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
		expect(mockLink.click).toHaveBeenCalled();
		expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
		expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-blob-url");
		mockAppendChild.mockRestore();
		mockRemoveChild.mockRestore();
	});
});
