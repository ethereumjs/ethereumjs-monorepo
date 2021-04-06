module.exports = function (config) {
  config.set({
    frameworks: ['karma-typescript', 'tap'],

    files: ['lib/**/*.ts', 'test/blockchain/chain.spec.ts'],

    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    reporters: ['progress'],

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        transforms: [
          require('karma-typescript-es6-transform')()
        ]
      },
      tsconfig: './tsconfig.karma.json',
    },

    browsers: ['FirefoxHeadless', 'ChromeHeadless'],

    colors: true,

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
