import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type ReleaseSource = {
  kind: 'release'
  repo: string
  tag: string
  asset: string
  url: string
  sha256: string
  size: number
  extractPaths: string[]
  /** When set, only these forks are extracted from the tarball (index-driven). Smaller cache; tarball may be deleted after extract. */
  extractForks?: string[]
  defaultForks?: string[]
  /** Keep downloaded tarball on disk after extract (default false when `extractForks` is set). */
  retainTarball?: boolean
  note?: string
}

export type PathSource = {
  kind: 'path'
  paths: string[]
}

export type FixtureSource = ReleaseSource | PathSource

export type FixturesManifest = {
  cacheVersion: number
  sources: Record<string, FixtureSource>
}

const CONSENSUS_DIR = path.dirname(fileURLToPath(import.meta.url))
const MANIFEST_PATH = path.join(CONSENSUS_DIR, 'fixtures.json')
const BOGOTA_MANIFEST_PATH = path.join(CONSENSUS_DIR, 'fixtures.bogota.json')

export function manifestPathForSource(sourceName: string): string {
  if (sourceName === 'bogota-devnet') return BOGOTA_MANIFEST_PATH
  return MANIFEST_PATH
}

export function loadManifest(manifestPath = MANIFEST_PATH): FixturesManifest {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as FixturesManifest
}

export function loadManifestForSource(sourceName: string): FixturesManifest {
  return loadManifest(manifestPathForSource(sourceName))
}

export function getReleaseSource(sourceName: string): ReleaseSource {
  const manifest = loadManifestForSource(sourceName)
  const source = manifest.sources[sourceName]
  if (source === undefined || source.kind !== 'release') {
    throw new Error(`Source "${sourceName}" is not a release download`)
  }
  return source
}

export function manifestPath(): string {
  return MANIFEST_PATH
}

export function bogotaManifestPath(): string {
  return BOGOTA_MANIFEST_PATH
}

export function defaultCacheRoot(): string {
  return (
    process.env.EST_FIXTURES_CACHE ??
    path.join(os.homedir(), '.cache', 'ethereumjs', 'est-fixtures')
  )
}

export function releaseCacheDir(
  sourceName: string,
  tag: string,
  cacheRoot = defaultCacheRoot(),
): string {
  const safeTag = tag.replace(/[/\\]/g, '_')
  return path.join(cacheRoot, sourceName, safeTag)
}

export function extractedFixturesRoot(
  sourceName: string,
  tag: string,
  cacheRoot = defaultCacheRoot(),
): string {
  return path.join(releaseCacheDir(sourceName, tag, cacheRoot), 'extracted')
}

/** Per-fork index extract (CI + targeted local runs). */
export function extractedForkRoot(
  sourceName: string,
  tag: string,
  fork: string,
  cacheRoot = defaultCacheRoot(),
): string {
  return path.join(releaseCacheDir(sourceName, tag, cacheRoot), 'forks', fork)
}

export function tarballCompleteMarker(baseDir: string): string {
  return path.join(baseDir, '.tarball-complete')
}

export function forkCompleteMarker(forkRoot: string): string {
  return path.join(forkRoot, '.complete')
}

export function forkTreeReady(root: string): boolean {
  return (
    fs.existsSync(path.join(root, '.meta', 'index.json')) &&
    (fs.existsSync(path.join(root, 'state_tests')) ||
      fs.existsSync(path.join(root, 'blockchain_tests')))
  )
}

export function resolveSourceRoot(sourceName: string, manifest = loadManifest()): string {
  const source = manifest.sources[sourceName]
  if (source === undefined) {
    throw new Error(`Unknown fixture source "${sourceName}"`)
  }
  if (source.kind === 'path') {
    const vmPkg = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))))
    const first = source.paths[0]
    return path.resolve(vmPkg, first, '..')
  }
  return extractedFixturesRoot(sourceName, source.tag)
}
