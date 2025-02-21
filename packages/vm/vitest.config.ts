import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [topLevelAwait()],
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})
