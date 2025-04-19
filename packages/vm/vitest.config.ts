import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    //root: '../..',
    plugins: [topLevelAwait()],
    optimizeDeps: {
      exclude: ['kzg-wasm', '@noble/curves'],
    },
    ssr: {
      noExternal: ['@noble/curves'],
    },
    test: {
      coverage: {
        enabled: true,
        allowExternal: true,
        include: ['**/packages/*/src/**/*.{ts,js}', '**/packages/noble-curves/**/*.{ts,js}'],
        exclude: ['**/packages/ethereum-tests'],
        reporter: ['text', 'html'],
      },
    },
  }),
)
