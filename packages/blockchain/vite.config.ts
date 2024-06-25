import { defineConfig } from 'vitest/config'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [visualizer({ open: true, gzipSize: true })],
  build: {
    rollupOptions: {
      // We choose safest to get worst case values
      treeshake: 'safest',
    },
    lib: {
      entry: 'src/index.ts',
      name: '@ethereumjs/blockchain',
      fileName: (format) => `ethereumjs-blockchain-bundle.${format}.js`,
      // only build for es
      formats: ['es'],
    },
  },
})
