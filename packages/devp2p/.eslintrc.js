module.exports = {
  extends: '../../config/eslint.js',
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
        allowAny: false,
      },
    ],
    'no-redeclare': 'off',
    'no-undef': 'off', // temporary until fixed: 'NodeJS' is not defined
  },
}
