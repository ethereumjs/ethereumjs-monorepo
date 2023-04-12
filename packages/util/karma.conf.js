module.exports = function (config) {
  config.set({
    frameworks: ['tap', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
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
      tsconfig: './tsconfig.json',
    },
    colors: true,
    reporters: ['progress', 'karma-typescript'],
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
    concurrency: 1,
    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
  })
}
