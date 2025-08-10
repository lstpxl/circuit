/**
 * Verifies that main.tsx mounts the app into #root.
 * We mock react-dom/client to intercept createRoot + render.
 */
const renderMock = jest.fn();

// Explicitly type the single allowed argument (container element)
type CreateRootArg = Element | Document | DocumentFragment | Comment;
const createRootMock = jest.fn((container: CreateRootArg) => {
	expect(container).toBeDefined(); // touch to avoid unused warning
	return { render: renderMock };
});

jest.mock("react-dom/client", () => ({
	createRoot: (container: CreateRootArg) => createRootMock(container),
}));

beforeEach(() => {
	document.body.innerHTML = '<div id="root"></div>';
	renderMock.mockClear();
	createRootMock.mockClear();
});

test("main mounts application", async () => {
	// Import after setting up DOM & mocks
	await import("../main");

	expect(createRootMock).toHaveBeenCalledTimes(1);
	const rootElemArg = createRootMock.mock.calls[0][0] as HTMLElement;
	expect(rootElemArg.id).toBe("root");
	expect(renderMock).toHaveBeenCalledTimes(1);
});
