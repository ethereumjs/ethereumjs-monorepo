import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: ['packages/*/vitest.config.{e2e,unit}.ts'],
  },
})
