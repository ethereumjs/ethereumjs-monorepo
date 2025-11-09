import { dirname } from 'path'
import { fileURLToPath } from 'url'
import rootConfig from '../../eslint.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default [
  ...rootConfig,
  {
    ignores: ['./ethereumjs-evm-bundle.es.js'],
  },
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
      '@typescript-eslint/no-use-before-define': 'off',
      'no-invalid-this': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['test/util.ts', 'test/tester/**/*.ts', 'examples/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
