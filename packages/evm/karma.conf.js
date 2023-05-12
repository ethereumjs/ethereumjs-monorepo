// Karma configuration
// Generated on Fri Mar 01 2019 22:02:29 GMT+0100 (CET)

module.exports = function (config) {
  config.set({
    // frameworks to use
    // available frameworks: https://www.npmjs.com/browse/keyword/karma-adapter
    frameworks: ['karma-typescript', 'tap'],

    // list of files / patterns to load in the browser
    files: ['./src/**/*.ts', './test/**/*.ts'],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        acornOptions: {
          ecmaVersion: 12,
        },
        resolve: {
          alias: {
            'bigint-crypto-utils': '../../node_modules/bigint-crypto-utils/dist/bundle.umd.js',
          },
        },
        ignore: ['c-kzg'],
      },
    },

    proxies: {
      '/mcl_c384_256.wasm': '../../node_modules/mcl-wasm/mcl_c384_256.wasm',
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/browse/keyword/karma-reporter
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
    // available browser launchers: https://www.npmjs.com/browse/keyword/karma-launcher
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
  })
}
