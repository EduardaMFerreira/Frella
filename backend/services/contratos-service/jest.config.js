module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transformIgnorePatterns: [
    'node_modules/(?!(cockatiel)/)',
  ],
  moduleNameMapper: {
    "^@frella/shared$": "<rootDir>/../../packages/shared/index.ts"
  }
};