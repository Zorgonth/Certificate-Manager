export default {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testMatch: ["**/__tests__/**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	clearMocks: true,
	restoreMocks: true,
	resetMocks: true,
};
 