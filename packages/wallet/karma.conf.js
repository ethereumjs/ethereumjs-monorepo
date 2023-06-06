module.exports = function (config) {
  config.set({
    frameworks: ['tap', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    files: ['src/**/*.ts', 'test/**/*.spec.ts'],
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        acornOptions: {
          ecmaVersion: 13,
        },
      },
    },
    colors: true,
    reporters: ['progress', 'karma-typescript'],
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
    concurrency: 1,
    // Extend timeouts for long tests
    browserDisconnectTimeout: 1000000,
    browserNoActivityTimeout: 1000000,
  })
}
