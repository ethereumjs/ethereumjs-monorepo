import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [topLevelAwait.default()],
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      all: true,
      reporter: ['lcov'],
    },
  },
})
