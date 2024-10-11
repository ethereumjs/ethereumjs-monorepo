
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        ...configDefaults.exclude,
        // process.nextTick is not a function
        'test/stream.spec.ts'
      ],
    },
  }
  ))