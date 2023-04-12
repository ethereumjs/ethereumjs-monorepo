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
            'bigint-crypto-utils': '../../node_modules/bigint-crypto-utils/dist/bundles/umd.js',
            '@chainsafe/persistent-merkle-tree/hasher':
              '../../node_modules/@chainsafe/persistent-merkle-tree/lib/hasher/noble.js',
            '@chainsafe/as-sha256/hashObject':
              '../../node_modules/@chainsafe/as-sha256/lib/hashObject.js',
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
