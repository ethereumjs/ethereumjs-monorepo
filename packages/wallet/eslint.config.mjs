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
    rules: {
      'no-restricted-syntax': 'warn',
    },
  },
  {
    files: ['test/index.spec.ts', 'examples/**/*'],
    rules: {
      'no-prototype-builtins': 'warn',
      'no-console': 'off',
    },
  },
]
