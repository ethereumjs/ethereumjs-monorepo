process.env.ethTest = 'TransactionTests'

module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'detectBrowsers', 'tap'],
    files: ['./test-build/test/api.js', './test-build/test/fake.js'],
    preprocessors: {
      './test-build/**/*.js': ['browserify']
    },
    singleRun: true,
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function(availableBrowsers) {
        return ['Firefox']
      },
    }
  })
}
