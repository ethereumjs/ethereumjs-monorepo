import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  test: {
    exclude: [
      ...configDefaults.exclude,
      // Importing a module script failed.
      'test/rpcStateManager.spec.ts',
      // undefined is not an object (evaluating 'state.reading')
      'test/stateManager.storage.spec.ts',
    ],
  },
})
