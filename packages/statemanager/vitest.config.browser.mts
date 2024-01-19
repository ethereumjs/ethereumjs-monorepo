import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser'

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [wasm(), topLevelAwait()],
    test: {
      exclude: [
        ...configDefaults.exclude,
        // Importing pedersenHash through wasm failed.
        'test/statelessVerkleStateManager.spec.ts',
        // Importing a module script failed.
        'test/rpcStateManager.spec.ts',
        // undefined is not an object (evaluating 'state.reading')
        'test/stateManager.storage.spec.ts',
      ],
    },
  })
)
