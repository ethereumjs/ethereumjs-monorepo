import { dirname } from 'path'
import { fileURLToPath } from 'url'
import rootConfig from '../../eslint.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default [
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.lint.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },
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
