module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.browser.json', './tsconfig.eslint.json'],
  },
  rules: {},
  overrides: [
    {
      files: ['test/**/*.ts'],
      rules: {
        'implicit-dependencies/no-implicit': ['error', { peer: false, dev: true, optional: false }],
      },
    },
    {
      files: ['bin/**.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: ['webpack.config.js'],
}
