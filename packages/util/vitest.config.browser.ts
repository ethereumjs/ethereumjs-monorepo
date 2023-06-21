import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // access control
      'test/provider.spec.ts',
    ],
    isolate: true,
  },
})
