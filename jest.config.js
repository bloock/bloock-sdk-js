module.exports = {
    rootDir: ".",
    clearMocks: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "types\\.ts",
      "index\\.ts",
      ".+\\.d\\.ts"
    ],
    testPathIgnorePatterns: ["/dist/", "/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    }
  };