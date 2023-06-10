module.exports = function (config) {
  config.set({
    browserNoActivityTimeout: 60000,
    frameworks: ['karma-typescript', 'tap'],
    files: ['./test/**/*.ts', './src/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        acornOptions: {
          ecmaVersion: 13,
        },
        resolve: {
          alias: {
            'bigint-crypto-utils': '../../node_modules/bigint-crypto-utils/dist/bundle.umd.js',
          },
        },
      },
    },
    concurrency: 1,
    reporters: ['dots'],
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
  })
}
