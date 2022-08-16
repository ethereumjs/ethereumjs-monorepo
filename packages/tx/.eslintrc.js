module.exports = {
  extends: '../../config/eslint.js',
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
}
