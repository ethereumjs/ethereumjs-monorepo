import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    optimizeDeps: {
      exclude: ['kzg-wasm'],
    },
    test: {
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['lcov'],
      },
      exclude: ['test/consensus/**'],
    },
  }),
)
