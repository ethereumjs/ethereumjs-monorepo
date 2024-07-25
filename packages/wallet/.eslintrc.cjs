module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
  },
  overrides: [
    {
      files: ['test/index.spec.ts', "examples/**/*"],
      rules: {
        'github/array-foreach': 'warn',
        'no-prototype-builtins': 'warn',
        'no-console': 'off',
      },
    },
  ],
}
