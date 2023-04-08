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
            'bigint-crypto-utils': '../../node_modules/bigint-crypto-utils/dist/bundles/umd.js',
            '@chainsafe/persistent-merkle-tree/hasher':
              '../../node_modules/@chainsafe/persistent-merkle-tree/lib/hasher/noble.js',
            '@chainsafe/as-sha256/hashObject':
              '../../node_modules/@chainsafe/as-sha256/lib/hashObject.js',
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
