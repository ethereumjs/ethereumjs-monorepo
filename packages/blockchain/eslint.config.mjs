import rootConfig from '../../eslint.config.mjs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

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
    files: ['test/sim/**.ts', 'examples/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]
