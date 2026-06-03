module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^winston$": "<rootDir>/node_modules/winston",
    "^express$": "<rootDir>/node_modules/express",
    "^uuid$": "<rootDir>/node_modules/uuid"
  }
};