import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [topLevelAwait()],
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
  test: {
    exclude: ['test/api/t8ntool'],
    coverage: {
      provider: 'v8',
      enabled: true,
      all: true,
      reporter: ['lcov'],
    },
  },
})
