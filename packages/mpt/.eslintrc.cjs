module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
  },
  overrides: [
    {
      files: ['benchmarks/*.ts', 'examples/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
