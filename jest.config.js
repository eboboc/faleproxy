module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    },
    // You can add specific thresholds for important files later
    "./tests/**/*.js": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  // Exclude node_modules from coverage
  coveragePathIgnorePatterns: ['/node_modules/']
};
