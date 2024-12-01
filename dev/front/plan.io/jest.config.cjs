module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // Add other modules here if needed
  ],
  moduleFileExtensions: ['js', 'jsx', 'mjs'], // Add 'mjs' to the extensions
};