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
    files: ['benchmarks/*.ts', 'examples/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
]
