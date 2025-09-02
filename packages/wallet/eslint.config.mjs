import rootConfig from '../../eslint.config.mjs'

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
      'no-prototype-builtins': 'warn',
      'no-console': 'off',
    },
  },
]
