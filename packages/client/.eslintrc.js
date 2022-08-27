module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.browser.json', './tsconfig.eslint.json'],
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
        allowAny: false,
      },
    ],
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
