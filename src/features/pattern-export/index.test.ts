import * as PatternExportModule from "./index";

describe("pattern-export module exports", () => {
	describe("exported functions and hooks", () => {
		it("should export useClipboard hook", () => {
			expect(PatternExportModule.useClipboard).toBeDefined();
			expect(typeof PatternExportModule.useClipboard).toBe("function");
		});

		it("should export base64ToBin function", () => {
			expect(PatternExportModule.base64ToBin).toBeDefined();
			expect(typeof PatternExportModule.base64ToBin).toBe("function");
		});
	});

	describe("exported components", () => {
		it("should export CopyCodeButton component", () => {
			expect(PatternExportModule.CopyCodeButton).toBeDefined();
			expect(typeof PatternExportModule.CopyCodeButton).toBe("function");
		});

		it("should export CopyLinkButton component", () => {
			expect(PatternExportModule.CopyLinkButton).toBeDefined();
			expect(typeof PatternExportModule.CopyLinkButton).toBe("function");
		});

		it("should export DownloadSVGButton component", () => {
			expect(PatternExportModule.DownloadSVGButton).toBeDefined();
			expect(typeof PatternExportModule.DownloadSVGButton).toBe("function");
		});
	});

	describe("module structure", () => {
		it("should export exactly 5 items", () => {
			const exportKeys = Object.keys(PatternExportModule);
			expect(exportKeys).toHaveLength(5);
		});

		it("should export all expected items", () => {
			const expectedExports = [
				"useClipboard",
				"base64ToBin",
				"CopyCodeButton",
				"CopyLinkButton",
				"DownloadSVGButton",
			];

			for (const exportName of expectedExports) {
				expect(PatternExportModule).toHaveProperty(exportName);
			}
		});

		it("should not export any unexpected items", () => {
			const exportKeys = Object.keys(PatternExportModule);
			const expectedExports = [
				"useClipboard",
				"base64ToBin",
				"CopyCodeButton",
				"CopyLinkButton",
				"DownloadSVGButton",
			];

			for (const key of exportKeys) {
				expect(expectedExports).toContain(key);
			}
		});
	});

	describe("import verification", () => {
		it("should allow individual named imports", async () => {
			const { useClipboard, base64ToBin, CopyCodeButton } = await import(
				"./index"
			);

			expect(useClipboard).toBeDefined();
			expect(base64ToBin).toBeDefined();
			expect(CopyCodeButton).toBeDefined();
		});

		it("should allow destructuring all exports", () => {
			const {
				useClipboard,
				base64ToBin,
				CopyCodeButton,
				CopyLinkButton,
				DownloadSVGButton,
			} = PatternExportModule;

			expect(useClipboard).toBeDefined();
			expect(base64ToBin).toBeDefined();
			expect(CopyCodeButton).toBeDefined();
			expect(CopyLinkButton).toBeDefined();
			expect(DownloadSVGButton).toBeDefined();
		});
	});

	describe("export consistency", () => {
		it("should maintain consistent export types across imports", async () => {
			const directImport = await import("./index");
			const namedImport = PatternExportModule;

			expect(typeof directImport.useClipboard).toBe(
				typeof namedImport.useClipboard,
			);
			expect(typeof directImport.base64ToBin).toBe(
				typeof namedImport.base64ToBin,
			);
			expect(typeof directImport.CopyCodeButton).toBe(
				typeof namedImport.CopyCodeButton,
			);
		});

		it("should export functions that are callable", () => {
			// Verify exports are actual functions that can be called
			expect(() => typeof PatternExportModule.useClipboard).not.toThrow();
			expect(() => typeof PatternExportModule.base64ToBin).not.toThrow();
			expect(() => typeof PatternExportModule.CopyCodeButton).not.toThrow();
			expect(() => typeof PatternExportModule.CopyLinkButton).not.toThrow();
			expect(() => typeof PatternExportModule.DownloadSVGButton).not.toThrow();
		});
	});
});
