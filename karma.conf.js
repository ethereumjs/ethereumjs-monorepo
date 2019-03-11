// Karma configuration
// Generated on Fri Mar 01 2019 22:02:29 GMT+0100 (CET)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'detectBrowsers', 'tap'],

    // list of files / patterns to load in the browser
    files: [
      './tests/api/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
      './tests/api/state/stateManager.js', // 4, "# should clear the cache when the state root is set"
      './tests/api/index.js', // 11, "# should run blockchain with mocked runBlock" not working"
      './tests/api/runBlockchain.js' // 2, "# should run with valid and invalid blocks"
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './tests/api/**/*.js': [ 'browserify' ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // karma-detect-browsers plugin config
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function (availableBrowsers) {
        return [ 'Firefox' ]
      }
    },

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000
  })
}
