import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    silent: true,
    testTimeout: 180000,
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['src/**'],
      // CI uploads coverage/lcov.info. Default Vitest reporters do not emit lcov.
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})

export default config