module.exports = function (config) {
  config.set({
    frameworks: ['karma-typescript', 'tap'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    plugins: ['karma-typescript', 'karma-tap', 'karma-chrome-launcher', 'karma-firefox-launcher'],
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
      },
    },
    colors: true,
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
  })
}
