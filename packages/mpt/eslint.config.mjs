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
    files: ['benchmarks/*.ts', 'examples/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
]
