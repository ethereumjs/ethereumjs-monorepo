process.env.ethTest = 'TransactionTests'

module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['detectBrowsers', 'tap', 'karma-typescript'],
    files: ['./test/api.ts', './test/transactionRunner.ts'],
    preprocessors: {
      'test/*.ts': ['env', 'karma-typescript'],
    },
    singleRun: true,
    plugins: [
      'karma-typescript',
      'karma-env-preprocessor',
      'karma-tap',
      'karma-firefox-launcher',
      'karma-detect-browsers',
    ],
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function(availableBrowsers) {
        return ['Firefox']
      },
    },
  })
}
