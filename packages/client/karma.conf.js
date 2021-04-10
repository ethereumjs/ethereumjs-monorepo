module.exports = function (config) {
  config.set({
    frameworks: ['karma-typescript', 'tap'],

    files: ['lib/**/*.ts', 'test/blockchain/chain.spec.ts'],

    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    reporters: ['progress'],

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        transforms: [
          function (context, callback) {
            // you may ask why on earth do we need this...,
            // so this is to make sure `cjs` extensions are treated as actual scripts and not text files
            // https://github.com/monounity/karma-typescript/blob/master/packages/karma-typescript/src/bundler/bundle-item.ts#L18 does not have cjs extension listed, so our file is not treated as script, and eventually require-ing it leads to a typeerror, since we get a string instead
            // luckily it's an OR with rhs being `this.transformedScript` expression, so all we need to do is to set it to true (which we do below)
            if (context.module.includes('web-encoding')) {
              // needed to set a flag transformedScript on BundledItem described above, https://github.com/monounity/karma-typescript/blob/master/packages/karma-typescript/src/bundler/transformer.ts#L94
              return callback(0, { dirty: true, transformedScript: true });
            }
            return callback(0, false);
          },
        ]
      },
      tsconfig: './tsconfig.karma.json',
    },

    browsers: ['FirefoxHeadless', 'ChromeHeadless'],

    colors: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
  })
}
