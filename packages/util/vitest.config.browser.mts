import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        ...configDefaults.exclude,
        // KZG tests use Node.js specific dependencies that aren't compatible with browser environment
        'test/kzg.spec.ts',
        'test/bench/kzg.bench.ts',
      ],
    },
  }),
)
