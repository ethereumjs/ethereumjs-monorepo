import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/** Active library packages whose public barrel must stay stable across refactors. */
export const PUBLIC_API_PACKAGES = [
  'binarytree',
  'block',
  'blockchain',
  'common',
  'devp2p',
  'e2store',
  'ethash',
  'evm',
  'genesis',
  'mpt',
  'rlp',
  'statemanager',
  'tx',
  'util',
  'vm',
  'wallet',
]

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
export const SNAPSHOT_DIR = join(REPO_ROOT, 'config', 'public-api-snapshots')

/**
 * @param {Record<string, unknown>} moduleNamespace
 * @returns {string[]}
 */
export function exportNamesFromModule(moduleNamespace) {
  return Object.keys(moduleNamespace)
    .filter((key) => key !== 'default')
    .sort()
}

/**
 * @param {string} packageDirName folder under packages/
 */
export async function collectPackageExportNames(packageDirName) {
  const entry = join(REPO_ROOT, 'packages', packageDirName, 'src', 'index.ts')
  const mod = await import(pathToFileURL(entry).href)
  return exportNamesFromModule(mod)
}

export function snapshotPath(packageDirName) {
  return join(SNAPSHOT_DIR, `${packageDirName}.json`)
}

/**
 * @param {string} packageDirName
 * @returns {string[]}
 */
export function readSnapshot(packageDirName) {
  const path = snapshotPath(packageDirName)
  if (!existsSync(path)) {
    throw new Error(`Missing public API snapshot: ${path}`)
  }
  const data = JSON.parse(readFileSync(path, 'utf8'))
  if (!Array.isArray(data.exports)) {
    throw new Error(`Invalid snapshot format for ${packageDirName}`)
  }
  return [...data.exports].sort()
}

/**
 * @param {string} packageDirName
 * @param {string[]} exportNames
 */
export function writeSnapshot(packageDirName, exportNames) {
  mkdirSync(SNAPSHOT_DIR, { recursive: true })
  const payload = {
    package: packageDirName,
    exports: [...exportNames].sort(),
  }
  writeFileSync(snapshotPath(packageDirName), `${JSON.stringify(payload, null, 2)}\n`)
}
