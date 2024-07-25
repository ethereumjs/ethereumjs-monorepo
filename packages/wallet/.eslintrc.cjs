module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
  },
  overrides: [
    {
      files: ['test/index.spec.ts'],
      rules: {
        'github/array-foreach': 'warn',
        'no-prototype-builtins': 'warn',
      },
    },
  ],
}
