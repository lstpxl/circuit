export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/features/(.*)$": "<rootDir>/src/features/$1",
    "^@/entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@/shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@/widgets/(.*)$": "<rootDir>/src/widgets/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/app/(.*)$": "<rootDir>/src/app/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          jsx: "react-jsx", // Add this
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/main.tsx"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Handle ES modules
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};
