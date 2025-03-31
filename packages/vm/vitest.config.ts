import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [topLevelAwait()],
    optimizeDeps: {
      exclude: ['kzg-wasm'],
    },
  }),
)
