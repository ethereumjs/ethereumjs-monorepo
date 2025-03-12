module.exports = [
  ...require('../../config/eslint.cjs'),
  {
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: ['./tsconfig.lint.json'],
        extraFileExtensions: ['.json'],
        sourceType: 'module',
      },
    },
  },
  {
    files: ['test/index.spec.ts', 'examples/**/*'],
    rules: {
      'github/array-foreach': 'warn',
      'no-prototype-builtins': 'warn',
      'no-console': 'off',
    },
  },
]
