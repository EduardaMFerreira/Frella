module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@frella/shared$": "<rootDir>/../../packages/shared/index.ts"
  }
};