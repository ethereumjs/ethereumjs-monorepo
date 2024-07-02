
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        ...configDefaults.exclude,
        // Importing pedersenHash through wasm failed.
        'test/statelessVerkleStateManager.spec.ts',
        // [vitest] queueMock is not implemented in browser environment yet.
        'test/rpcStateManager.spec.ts',
      ],
    },
  })
)