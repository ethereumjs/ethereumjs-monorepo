module.exports = {
  extends: '../../config/eslint.cjs',
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
