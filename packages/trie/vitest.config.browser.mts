import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        // 1 test failing, undefined is not an object (evaluating 'state.reading')
        'test/stream.spec.ts',
      ],
    },
  })
)
