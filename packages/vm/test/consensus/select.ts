import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { RunnerCliOptions } from './cli.ts'
import { loadEstFixtures, loadLegacyBlockchainFixtures, parseShard } from './fixtureLoader.ts'
import { cliForkToLegacyNetwork, forkMatchesFilter } from './forks.ts'
import {
  type FixtureSource,
  defaultCacheRoot,
  extractedFixturesRoot,
  extractedForkRoot,
  forkCompleteMarker,
  forkTreeReady,
  getReleaseSource,
  loadManifest,
  loadManifestForSource,
} from './manifest.ts'
import { defaultSkipCategories, parseSkipCategories, shouldSkipTest } from './skips.ts'
import type { ConsensusFixtureFormat, ConsensusTestCase } from './types.ts'

function vmPackageRoot(): string {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
}

export function resolveLegacyRoots(source: FixtureSource & { kind: 'path' }): string[] {
  const pkg = vmPackageRoot()
  return source.paths.map((p) => path.resolve(pkg, p))
}

export function estFixturesCacheHint(sourceName: string, fork?: string): string {
  const cache = defaultCacheRoot()
  const forkHint = fork !== undefined ? ` --fork ${fork}` : ''
  return (
    `EST fixtures for "${sourceName}" are not cached.\n` +
    `From packages/vm: npm run fixtures:fetch -- ${sourceName}${forkHint}\n` +
    `Cache: ${cache} (set EST_FIXTURES_CACHE to share across local checkouts).\n` +
    `Alternatives: --fixture-root <dir> (local tree), --auto-fetch (download now), --skip-fetch with an existing cache only.`
  )
}

function singleForkFromFilter(forkFilter: Set<string> | undefined): string | undefined {
  if (forkFilter === undefined || forkFilter.size !== 1) return undefined
  return [...forkFilter][0]
}

function isForkRootReady(
  sourceName: string,
  tag: string,
  fork: string,
  cacheRoot: string,
): boolean {
  const forkRoot = extractedForkRoot(sourceName, tag, fork, cacheRoot)
  return fs.existsSync(forkCompleteMarker(forkRoot)) && forkTreeReady(forkRoot)
}

function isFullRootReady(sourceName: string, tag: string, cacheRoot: string): boolean {
  const root = extractedFixturesRoot(sourceName, tag, cacheRoot)
  return forkTreeReady(root)
}

export async function resolveEstRoot(
  sourceName: string,
  options: RunnerCliOptions,
): Promise<string> {
  const pkg = vmPackageRoot()
  if (options.fixtureRoot !== undefined) {
    const p = options.fixtureRoot
    return path.isAbsolute(p) ? p : path.resolve(pkg, p)
  }

  loadManifestForSource(sourceName)
  const source = getReleaseSource(sourceName)
  const cacheRoot = defaultCacheRoot()
  const singleFork = singleForkFromFilter(options.forkFilter)

  if (singleFork !== undefined) {
    const forkRoot = extractedForkRoot(sourceName, source.tag, singleFork, cacheRoot)
    if (isForkRootReady(sourceName, source.tag, singleFork, cacheRoot)) {
      return forkRoot
    }
    if (options.skipFetch === true) {
      throw new Error(estFixturesCacheHint(sourceName, singleFork))
    }
    if (options.autoFetch === true) {
      const { fetchForkExtract } = await import('./fetchFixtures.ts')
      return fetchForkExtract(sourceName, singleFork)
    }
    throw new Error(estFixturesCacheHint(sourceName, singleFork))
  }

  const root = extractedFixturesRoot(sourceName, source.tag, cacheRoot)
  if (isFullRootReady(sourceName, source.tag, cacheRoot)) {
    return root
  }

  if (options.skipFetch === true) {
    throw new Error(estFixturesCacheHint(sourceName))
  }
  if (options.autoFetch === true) {
    const { fetchReleaseSource } = await import('./fetchFixtures.ts')
    return fetchReleaseSource(sourceName, { warmRecent: sourceName === 'tests' })
  }
  throw new Error(estFixturesCacheHint(sourceName))
}

async function resolveEstRootsForSelection(
  sourceName: string,
  options: RunnerCliOptions,
): Promise<string[]> {
  const singleFork = singleForkFromFilter(options.forkFilter)
  if (singleFork !== undefined) {
    return [await resolveEstRoot(sourceName, options)]
  }

  const filter = options.forkFilter
  if (filter !== undefined && filter.size > 1) {
    const source = getReleaseSource(sourceName)
    const cacheRoot = defaultCacheRoot()
    const roots: string[] = []
    for (const fork of filter) {
      if (isForkRootReady(sourceName, source.tag, fork, cacheRoot)) {
        roots.push(extractedForkRoot(sourceName, source.tag, fork, cacheRoot))
        continue
      }
      if (isFullRootReady(sourceName, source.tag, cacheRoot)) {
        return [extractedFixturesRoot(sourceName, source.tag, cacheRoot)]
      }
      if (options.skipFetch) {
        throw new Error(estFixturesCacheHint(sourceName, fork))
      }
      if (options.autoFetch) {
        const { fetchForkExtract } = await import('./fetchFixtures.ts')
        roots.push(await fetchForkExtract(sourceName, fork))
        continue
      }
      throw new Error(estFixturesCacheHint(sourceName, fork))
    }
    if (roots.length === filter.size) return roots
  }

  return [await resolveEstRoot(sourceName, options)]
}

function applyFilters(
  cases: ConsensusTestCase[],
  options: RunnerCliOptions,
  forkFilter: Set<string> | undefined,
): ConsensusTestCase[] {
  const skipCategories =
    options.skipCategories.size > 0 ? options.skipCategories : defaultSkipCategories()
  const runOnly = options.runSkippedCategories

  return cases.filter((c) => {
    if (options.format !== 'all' && c.format !== options.format) return false
    if (!forkMatchesFilter(c.fork, forkFilter)) return false
    if (options.dir !== undefined) {
      const re = new RegExp(options.dir)
      if (!re.test(c.filePath)) return false
    }
    if (options.file !== undefined) {
      const re = new RegExp(options.file)
      if (!re.test(path.basename(c.filePath))) return false
    }
    if (options.test !== undefined) {
      const exact = options.test.startsWith('=')
      const needle = exact ? options.test.slice(1) : options.test
      if (exact ? c.id !== needle : !c.id.includes(needle)) return false
    }
    if (shouldSkipTest(c.id, c.fork, { skipCategories, runOnlyCategories: runOnly })) {
      return false
    }
    return true
  })
}

export async function selectTestCases(options: RunnerCliOptions): Promise<{
  cases: ConsensusTestCase[]
  rootLabel: string
}> {
  const shard = options.rerunFailedPath !== undefined ? undefined : parseShard(options.shard)
  const forkFilter = options.forkFilter

  if (options.source === 'legacy') {
    const manifest = loadManifest()
    const source = manifest.sources.legacy
    if (source?.kind !== 'path') throw new Error('legacy source missing from manifest')
    const network = cliForkToLegacyNetwork(options.legacyFork ?? 'Prague')
    const roots = resolveLegacyRoots(source)
    const cases = applyFilters(
      loadLegacyBlockchainFixtures(roots, network, shard),
      options,
      forkFilter,
    )
    return { cases, rootLabel: `legacy:${network}` }
  }

  const roots = await resolveEstRootsForSelection(options.source, options)
  const formats: ConsensusFixtureFormat[] =
    options.format === 'all' ? ['state_tests', 'blockchain_tests'] : [options.format]

  let cases: ConsensusTestCase[] = []
  for (const root of roots) {
    for (const format of formats) {
      cases = cases.concat(loadEstFixtures(root, format, shard))
    }
  }
  cases = applyFilters(cases, options, forkFilter)
  const rootLabel =
    roots.length === 1 ? `${options.source}:${roots[0]}` : `${options.source}:${roots.length}-roots`
  return { cases, rootLabel }
}

export function groupCasesByFile(cases: ConsensusTestCase[]): Map<string, ConsensusTestCase[]> {
  const map = new Map<string, ConsensusTestCase[]>()
  for (const c of cases) {
    const list = map.get(c.filePath) ?? []
    list.push(c)
    map.set(c.filePath, list)
  }
  return map
}
