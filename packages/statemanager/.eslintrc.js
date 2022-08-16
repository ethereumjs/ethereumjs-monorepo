module.exports = {
  extends: '../../config/eslint.js',
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
        allowAny: false,
      },
    ],
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
  },
}
