import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Locate `worker/index` inside the installed `@ethereumjs/devp2p` package.
 * Pass the calling file's `import.meta.url` (your app entry or smoke script).
 */
function devp2pPackageRoot(callerModuleUrl: string): string {
  const require = createRequire(callerModuleUrl)
  const entry = require.resolve('@ethereumjs/devp2p')
  const entryDir = dirname(entry)
  const normalized = entryDir.replace(/\\/g, '/')
  if (normalized.endsWith('/src')) return dirname(entryDir)
  if (normalized.endsWith('/dist/esm') || normalized.endsWith('/dist/cjs')) {
    return dirname(dirname(entryDir))
  }
  return entryDir
}

export function resolveThreadedNetworkModuleUrl(callerModuleUrl: string): string {
  const pkgRoot = devp2pPackageRoot(callerModuleUrl)
  const candidates = [
    join(pkgRoot, 'src/worker/index.ts'),
    join(pkgRoot, 'dist/esm/worker/index.js'),
    join(pkgRoot, 'dist/cjs/worker/index.js'),
  ]
  for (const path of candidates) {
    if (existsSync(path)) return pathToFileURL(path).href
  }
  throw new Error('Could not locate @ethereumjs/devp2p worker module (build the package first)')
}

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
