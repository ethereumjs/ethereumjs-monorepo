module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.browser.json', './tsconfig.eslint.json'],
  },
  overrides: [
    {
      files: ['bin/**.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
