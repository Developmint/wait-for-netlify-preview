module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'main.js'
  ],
  moduleFileExtensions: ['js', 'mjs', 'json'],
  expand: true,
  forceExit: false
}
