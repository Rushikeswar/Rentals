export default {
  transform: {
    '^.+\\.js$': 'babel-jest', // Transpile ES modules
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Handle ESM imports without extensions
  },
  testEnvironment: 'node', // Suitable for backend/server testing
  globals: {
    'jest': {
      useFakeTimers: true
    }
  }
};

