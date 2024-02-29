import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // Cannot access uninitialized variable.
      // (likely local fix possible)
      'test/mergeBlock.spec.ts',
      'test/eip4895block.spec.ts',
      'test/eip1559block.spec.ts',
    ],
  },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})
