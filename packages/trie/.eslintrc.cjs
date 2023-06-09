module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.benchmarks.json'],
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
