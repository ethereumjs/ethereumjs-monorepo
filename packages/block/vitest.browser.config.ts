import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: [
      { find: 'c-kzg', replacement: 'fs' }, // Replace c-kzg with any random module as this will be skipped in browser tests anyway
    ],
  },
})
