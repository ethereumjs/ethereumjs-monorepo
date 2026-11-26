import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

const typescriptFirst = ['typescript', 'import', 'module', 'node', 'default'] as const
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export default defineConfig({
  resolve: {
    alias: {
      '@ethereumjs/statemanager': path.join(repoRoot, 'packages/statemanager/src/index.ts'),
      '@ethereumjs/devp2p': path.join(repoRoot, 'packages/devp2p/src/index.ts'),
    },
    conditions: [...typescriptFirst],
  },
  environments: {
    ssr: {
      resolve: {
        conditions: [...typescriptFirst],
      },
    },
  },
})
