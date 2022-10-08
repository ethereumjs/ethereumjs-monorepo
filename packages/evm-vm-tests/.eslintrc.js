module.exports = {
  extends: '../../config/eslint.js',
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
  },
  overrides: [
    {
      files: ['test/util.ts', 'test/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
