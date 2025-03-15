import rootConfig from '../../config/eslint.config.mjs'

export default [
  ...rootConfig,
  {
    rules: {
      'no-redeclare': 'off',
      'no-undef': 'off', // temporary until fixed: 'NodeJS' is not defined
    },
  },
  {
    files: ['examples/**/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
