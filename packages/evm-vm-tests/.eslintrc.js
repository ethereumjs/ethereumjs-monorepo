module.exports = {
  extends: '../../config/eslint.js',
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
  },
  overrides: [
    {
      files: ['tests/util.ts', 'tests/tester/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
