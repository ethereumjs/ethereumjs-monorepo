module.exports = function (config) {
  config.set({
    frameworks: ['karma-typescript', 'browserify', 'tap'],

    files: ['test/blockchain/chain.js', 'test/**/*.ts'],

    preprocessors: {
      'test/blockchain/chain.js': ['browserify'],
      'test/**/*.ts': ['karma-typescript']
    },

    reporters: ['progress'],

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        entrypoints: /test\/(.*)\.(js|ts)/,
        transforms: [
          require('karma-typescript-es6-transform')({
            plugins: ['@babel/plugin-transform-spread']
          })
        ]
      }
    },

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
