process.env.ethTest = 'BasicTests'

module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'detectBrowsers', 'tap'],
    files: [
      './tests/genesis.js',
      './tests/difficulty.js'
    ],
    preprocessors: {
      'tests/*.js': ['browserify', 'env']
    },
    singleRun: true,
    plugins: [
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-env-preprocessor',
      'karma-tap',
      'karma-firefox-launcher',
      'karma-detect-browsers'
    ],
    reporters: ['progress'],
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function (availableBrowser) {
        if (process.env.TRAVIS) {
          return ['Firefox']
        }

        var browsers = ['Chrome', 'Firefox']
        return browsers.filter(function (browser) {
          return availableBrowser.indexOf(browser) !== -1
        })
      }
    }
  })
}
