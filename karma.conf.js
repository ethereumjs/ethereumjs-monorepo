module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'detectBrowsers', 'tap'],
    files: ['./test/*.js'],
    preprocessors: {
      './dist/**/*.js': ['browserify'],
      './test/**/*.js': ['browserify']
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
