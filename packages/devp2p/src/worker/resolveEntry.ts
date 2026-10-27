import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Resolve the worker bootstrap script next to the worker module (source or build output).
 *
 * @param fromModuleUrl Pass `import.meta.url` from {@link createThreadedNetwork}'s module.
 */
export function resolveWorkerEntryPath(fromModuleUrl: string): string {
  const baseDir = dirname(fileURLToPath(fromModuleUrl))
  const candidates = [
    join(baseDir, 'workerEntry.ts'),
    join(baseDir, 'workerEntry.js'),
    join(baseDir, 'workerEntry.cjs'),
  ]
  for (const path of candidates) {
    if (existsSync(path)) return path
  }
  return join(baseDir, 'workerEntry.js')
}

/** Register tsx loader hook for Worker when running from TypeScript sources. */
export function workerExecArgv(entryPath: string, fromModuleUrl: string): string[] {
  if (entryPath.endsWith('.ts')) {
    try {
      createRequire(fromModuleUrl).resolve('tsx')
      return ['--import', 'tsx']
    } catch {
      return []
    }
  }
  return []
}
