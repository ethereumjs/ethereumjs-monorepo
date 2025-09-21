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
    files: ['test/sim/**.ts', 'examples/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]
