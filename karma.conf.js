module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'detectBrowsers', 'tap'],
    files: ['./test-build/test/index.js'],
    preprocessors: {
      './test-build/**/*.js': ['browserify'],
    },
    reporters: ['dots'],
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
