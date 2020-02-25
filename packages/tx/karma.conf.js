process.env.ethTest = 'TransactionTests'

module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'detectBrowsers', 'tap'],
    // the official transaction's test suite is disabled for now, see https://github.com/ethereumjs/ethereumjs-testing/issues/40
    files: ['./test-build/test/api.js', './test-build/test/fake.js'],
    preprocessors: {
      './test-build/**/*.js': ['browserify'],
    },
    singleRun: true,
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function(availableBrowsers) {
        return ['FirefoxHeadless']
      },
    },
  })
}
