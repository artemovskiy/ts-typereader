module.exports = {
  verbose: true,
  testEnvironment: "node",
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
};