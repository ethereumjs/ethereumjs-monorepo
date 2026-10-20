import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type LegacyTestsManifest = {
  cacheVersion: number
  repo: string
  commit: string
  slices: Record<string, { sparsePaths: string[]; description?: string }>
}

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const MANIFEST_PATH = path.join(REPO_ROOT, 'config/legacy-ethereum-tests.json')

export function loadLegacyTestsManifest(): LegacyTestsManifest {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as LegacyTestsManifest
}

export function defaultLegacyTestsCacheRoot(): string {
  return (
    process.env.LEGACY_ETHEREUM_TESTS_CACHE ??
    path.join(os.homedir(), '.cache', 'ethereumjs', 'legacy-ethereum-tests')
  )
}

export function legacyTestsTreeRoot(cacheRoot = defaultLegacyTestsCacheRoot()): string {
  const { commit } = loadLegacyTestsManifest()
  return path.join(cacheRoot, commit)
}

function sliceCompleteMarker(treeRoot: string, sliceName: string): string {
  return path.join(treeRoot, `.complete-${sliceName}`)
}

export function legacyTestsSliceReady(
  sliceName: string,
  cacheRoot = defaultLegacyTestsCacheRoot(),
): boolean {
  const manifest = loadLegacyTestsManifest()
  const slice = manifest.slices[sliceName]
  if (slice === undefined) {
    return false
  }
  const treeRoot = legacyTestsTreeRoot(cacheRoot)
  if (!fs.existsSync(sliceCompleteMarker(treeRoot, sliceName))) {
    return false
  }
  for (const rel of slice.sparsePaths) {
    if (!fs.existsSync(path.join(treeRoot, rel))) {
      return false
    }
  }
  return true
}

export function legacyBlockchainFixtureRoots(cacheRoot = defaultLegacyTestsCacheRoot()): string[] {
  const manifest = loadLegacyTestsManifest()
  const slice = manifest.slices.blockchain
  if (slice === undefined) {
    throw new Error('legacy-ethereum-tests.json missing blockchain slice')
  }
  const treeRoot = legacyTestsTreeRoot(cacheRoot)
  return slice.sparsePaths.map((rel) => path.join(treeRoot, rel))
}

export function legacyTestsFetchHint(sliceName: string): string {
  return (
    `Legacy ethereum/tests slice "${sliceName}" is not cached.\n` +
    `From repo root: npm run legacy-tests:fetch -- ${sliceName}\n` +
    `Cache: ${defaultLegacyTestsCacheRoot()} (set LEGACY_ETHEREUM_TESTS_CACHE to override).`
  )
}
