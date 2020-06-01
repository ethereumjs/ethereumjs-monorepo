module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'tap'],

    files: ['dist/bundle.js', './test/**/*.js'],

    // Exclude [test/node.js, test/net, test/sync, test/service] due to error: `Sorry, but CommonJS module replacement with td.replace() is only supported under Node.js runtimes.`
    // Exclude [test/rpc] due to error: `TypeError: superCtor is undefined`
    // Exclude [test/util/parse] due to hanging on `should parse geth params file`
    // Exclude [test/logging] due to error: `TypeError: logger.format is undefined`
    exclude: [
      './test/node.js',
      './test/net/**/*.js',
      './test/sync/**/*.js',
      './test/service/**/*.js',
      './test/rpc/**/*.js',
      './test/util/parse.js',
      './test/logging.js',
      './test/integration/**/*.js'
    ],

    preprocessors: {
      './test/**/*.js': ['browserify']
    },

    reporters: ['progress'],

    browsers: ['FirefoxHeadless', 'ChromeHeadless'],

    colors: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000
  })
}
