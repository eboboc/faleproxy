module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  // Specify which files to collect coverage from
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!jest.config.js'
  ],
  // Set coverageThreshold to null to not fail on low coverage
  coverageThreshold: null,
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  // Exclude node_modules from coverage
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/tests/']
};
