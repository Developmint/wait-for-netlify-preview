module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'index.js'
  ],
  moduleFileExtensions: ['js', 'mjs', 'json'],
  expand: true,
  forceExit: false
}
