module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.browser.json', './tsconfig.eslint.json'],
  },
  overrides: [
    {
      files: ['bin/**.ts', 'test/sim/**.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
