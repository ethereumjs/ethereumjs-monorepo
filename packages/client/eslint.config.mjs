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
    files: ['test/sim/**.ts', 'examples/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
    },
  },
]
