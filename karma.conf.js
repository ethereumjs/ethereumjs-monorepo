module.exports = function(config) {
  config.set({
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
    frameworks: ['browserify', 'tap'],
    plugins: ['karma-browserify', 'karma-tap', 'karma-chrome-launcher', 'karma-firefox-launcher'],
    files: ['./test/*.js'],
    preprocessors: {
      './dist/**/*.js': ['browserify'],
      './test/**/*.js': ['browserify'],
    },
    colors: true,
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
  })
}
