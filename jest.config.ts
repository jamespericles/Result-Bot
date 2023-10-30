import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 79,
      functions: 81,
      lines: 87,
      statements: 87,
    },
  },
  rootDir: '.',
}

export default jestConfig
