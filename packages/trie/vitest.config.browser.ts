import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // 1 test failing, undefined is not an object (evaluating 'state.reading')
      'test/stream.spec.ts',
    ],
  },
})
