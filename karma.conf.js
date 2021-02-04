module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    plugins: ['karma-mocha', 'karma-typescript', 'karma-chrome-launcher', 'karma-firefox-launcher'],
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/
      },
      tsconfig: './tsconfig.json'
    },
    colors: true,
    reporters: ['progress', 'karma-typescript'],
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000
  })
}
