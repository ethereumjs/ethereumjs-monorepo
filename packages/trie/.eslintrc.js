module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.benchmarks.json'],
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'error',
  },
  overrides: [
    {
      files: ['benchmarks/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
