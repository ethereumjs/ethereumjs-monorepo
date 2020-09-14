module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'tap'],
    files: ['./test-build/test/**/*.js'],
    preprocessors: {
      './test-build/**/*.js': ['browserify'],
    },
    concurrency: 1,
    reporters: ['dots'],
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
  })
}
