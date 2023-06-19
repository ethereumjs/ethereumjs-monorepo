import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['test/(integration|cli|sim)/**/*.spec.ts'],
    //   silent: true,
    isolate: true,
  },
})
