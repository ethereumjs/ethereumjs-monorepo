import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['lcov'],
    },
    exclude: ['test/tester/state.spec.ts', 'test/tester/blockchain.spec.ts'],
  },
})
