import rootConfig from '../../config/eslint.config.mjs'

export default [
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.lint.json'],
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
