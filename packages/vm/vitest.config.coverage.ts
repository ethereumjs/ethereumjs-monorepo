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
    exclude: [
      'test/tester/legacy/state.spec.ts',
      'test/tester/legacy/blockchain.spec.ts',
      'test/tester/consumeBal.test.ts',
    ],
  },
})
