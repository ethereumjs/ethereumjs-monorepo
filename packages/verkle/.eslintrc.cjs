module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.benchmarks.json'],
  },
  ignorePatterns: ['**/vendor/*.js'],
  overrides: [
    {
      files: ['benchmarks/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
