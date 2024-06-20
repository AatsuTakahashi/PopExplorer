module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^chart.js$': '<rootDir>/src/tests/__mocks__/chart.js',
    '^react-chartjs-2$': '<rootDir>/src/tests/__mocks__/react-chartjs-2.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
