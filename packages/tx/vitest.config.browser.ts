import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // default export for minimist
      // wrong ethereum-tests path reference (../ is stripped)
      'test/transactionRunner.spec.ts',
    ],
  },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})
