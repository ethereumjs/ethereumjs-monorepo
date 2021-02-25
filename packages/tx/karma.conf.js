process.env.ethTest = 'TransactionTests'

module.exports = function (config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'tap'],
    // the official transaction's test suite is disabled for now, see https://github.com/ethereumjs/ethereumjs-testing/issues/40
    files: ['./test-build/test/legacy.spec.js'],
    preprocessors: {
      './test-build/**/*.js': ['browserify'],
    },
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    concurrency: 1,
    singleRun: true,
  })
}
