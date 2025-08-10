import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "../useClipboard";

// Mock console.error to suppress error logs during tests
const originalConsoleError = console.error;

function mockClipboard() {
	Object.assign(navigator, {
		clipboard: {
			writeText: jest.fn().mockResolvedValue(undefined),
		},
	});
	return navigator.clipboard.writeText as jest.Mock;
}

describe("useClipboard", () => {
	beforeEach(() => {
		// Suppress console.error during tests
		console.error = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
		// Restore console.error
		console.error = originalConsoleError;
	});

	it("starts with idle status", () => {
		mockClipboard();
		const { result } = renderHook(() => useClipboard());
		expect(result.current.status).toBe("idle");
	});

	it("copies text successfully and sets status to copied", async () => {
		const writeText = mockClipboard();
		const { result } = renderHook(() => useClipboard());

		expect(result.current.status).toBe("idle");

		await act(async () => {
			const ok = await result.current.copy("hello");
			expect(ok).toBe(true);
		});

		expect(writeText).toHaveBeenCalledWith("hello");
		expect(result.current.status).toBe("copied");
	});

	it("sets status to copying during operation", async () => {
		let resolvePromise: () => void;
		const pendingPromise = new Promise<void>((resolve) => {
			resolvePromise = resolve;
		});

		Object.assign(navigator, {
			clipboard: {
				writeText: jest.fn().mockReturnValue(pendingPromise),
			},
		});

		const { result } = renderHook(() => useClipboard());

		act(() => {
			result.current.copy("test");
		});

		expect(result.current.status).toBe("copying");

		await act(async () => {
			resolvePromise();
			await pendingPromise;
		});

		expect(result.current.status).toBe("copied");
	});

	it("returns false and sets status to error on clipboard error", async () => {
		Object.assign(navigator, {
			clipboard: {
				writeText: jest.fn().mockRejectedValue(new Error("denied")),
			},
		});
		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const ok = await result.current.copy("fail");
			expect(ok).toBe(false);
		});

		expect(result.current.status).toBe("error");
		// Verify console.error was called
		expect(console.error).toHaveBeenCalledWith(
			"Failed to copy:",
			expect.any(Error),
		);
	});

	it("returns false and sets status to error when clipboard API is unavailable", async () => {
		// Store original clipboard to restore later
		const originalClipboard = navigator.clipboard;

		// Remove clipboard property
		// biome-ignore lint/performance/noDelete: required
		delete (navigator as unknown as Record<string, unknown>).clipboard;

		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const ok = await result.current.copy("test");
			expect(ok).toBe(false);
		});

		expect(result.current.status).toBe("error");

		// Restore clipboard
		if (originalClipboard) {
			Object.defineProperty(navigator, "clipboard", {
				value: originalClipboard,
				writable: true,
				configurable: true,
			});
		}
	});

	it("handles multiple copy operations correctly", async () => {
		const writeText = mockClipboard();
		const { result } = renderHook(() => useClipboard());

		// First copy
		await act(async () => {
			const ok = await result.current.copy("first");
			expect(ok).toBe(true);
		});
		expect(result.current.status).toBe("copied");

		// Second copy
		await act(async () => {
			const ok = await result.current.copy("second");
			expect(ok).toBe(true);
		});
		expect(result.current.status).toBe("copied");
		expect(writeText).toHaveBeenCalledTimes(2);
	});

	it("resets status from error to copying on new operation", async () => {
		// First operation fails
		Object.assign(navigator, {
			clipboard: {
				writeText: jest.fn().mockRejectedValue(new Error("first fail")),
			},
		});

		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			await result.current.copy("fail");
		});
		expect(result.current.status).toBe("error");

		// Second operation succeeds
		Object.assign(navigator, {
			clipboard: {
				writeText: jest.fn().mockResolvedValue(undefined),
			},
		});

		await act(async () => {
			const ok = await result.current.copy("success");
			expect(ok).toBe(true);
		});
		expect(result.current.status).toBe("copied");
	});
});
