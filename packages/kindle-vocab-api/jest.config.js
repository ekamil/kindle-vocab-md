/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\.(njk)$': '<rootDir>/readstringTransformer.js',
    '^.+\.(ts|html)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['./node_modules/', './.direnv'],
};