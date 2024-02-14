import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // c-kzg dependency
      'test/eip4844.spec.ts',
      // default export for minimist
      // wrong ethereum-tests path reference (../ is stripped)
      'test/transactionRunner.spec.ts',
    ],
  },
})
