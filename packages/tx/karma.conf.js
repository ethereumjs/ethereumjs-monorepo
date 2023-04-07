process.env.ethTest = 'TransactionTests'

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
          ecmaVersion: 12,
        },
        resolve: {
          alias: {
            '@chainsafe/persistent-merkle-tree/hasher':
              '../../node_modules/@chainsafe/persistent-merkle-tree/lib/hasher/noble.js',
            '@chainsafe/as-sha256/hashObject':
              '../../node_modules/@chainsafe/as-sha256/lib/hashObject.js',
          },
        },
      },
    },
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    concurrency: 1,
    singleRun: true,
  })
}
