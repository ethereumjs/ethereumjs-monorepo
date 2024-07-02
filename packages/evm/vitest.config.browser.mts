
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude:      [
        ...configDefaults.exclude,
        // readDirSync method not provided fs mock for vite
        'test/precompiles/eip-2537-bls.spec.ts',
      ]
    }
  })
)