module.exports = function (config) {
  config.set({
    frameworks: ['karma-typescript', 'tap'],
    files: ['./src/**/*.ts', './tests/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        acornOptions: {
          ecmaVersion: 11,
        },
        resolve: {
          alias: {
            'bigint-crypto-utils': '../../node_modules/bigint-crypto-utils/dist/bundles/umd.js',
          },
        },
      },
    },
    reporters: ['dots'],
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
    concurrency: 1,

    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
  })
}
