module.exports = {
  extends: '../../config/eslint.cjs',
  rules: {
    'import/extensions': 'off',
  },
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
