import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
export default defineConfig({
  environments: {
    ssr: {
      resolve: {
        conditions: ['typescript'],
      },
    },
  },
})
