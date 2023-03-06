/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\.(ts|html)$': 'ts-jest',
    '^.+\.(njk)$': '<rootDir>/readstringTransformer.js',
  }
};