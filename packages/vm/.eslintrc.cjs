module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
  },
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
  },
  overrides: [
    {
      files: ['test/util.ts', 'test/tester/**/*.ts', 'examples/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
