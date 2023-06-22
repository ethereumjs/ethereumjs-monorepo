import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // Importing a module script failed.
      'test/ethersStateManager.spec.ts',
      // undefined is not an object (evaluating 'state.reading')
      'test/stateManager.storage.spec.ts',
    ],
  },
})
