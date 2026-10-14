import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { RunnerCliOptions } from './cli.ts'
import { loadEstFixtures, loadLegacyBlockchainFixtures, parseShard } from './fixtureLoader.ts'
import { cliForkToLegacyNetwork, forkMatchesFilter } from './forks.ts'
import { type FixtureSource, defaultCacheRoot, loadManifest } from './manifest.ts'
import { defaultSkipCategories, parseSkipCategories, shouldSkipTest } from './skips.ts'
import type { ConsensusFixtureFormat, ConsensusTestCase } from './types.ts'

function vmPackageRoot(): string {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
}

export function resolveLegacyRoots(source: FixtureSource & { kind: 'path' }): string[] {
  const pkg = vmPackageRoot()
  return source.paths.map((p) => path.resolve(pkg, p))
}

export function estFixturesCacheHint(sourceName: string): string {
  const cache = defaultCacheRoot()
  return (
    `EST fixtures for "${sourceName}" are not cached.\n` +
    `From packages/vm: npm run fixtures:fetch -- ${sourceName}\n` +
    `Cache: ${cache} (set EST_FIXTURES_CACHE to share across local checkouts).\n` +
    `Alternatives: --fixture-root <dir> (local tree), --auto-fetch (download now), --skip-fetch with an existing cache only.`
  )
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
  const manifest = loadManifest()
  const source = manifest.sources[sourceName]
  if (source === undefined) throw new Error(`Unknown source ${sourceName}`)
  if (source.kind === 'path') {
    throw new Error(`Source ${sourceName} is path-based`)
  }
  const { extractedFixturesRoot, defaultCacheRoot } = await import('./manifest.ts')
  const root = extractedFixturesRoot(sourceName, source.tag, defaultCacheRoot())
  const ready =
    fs.existsSync(path.join(root, '.meta', 'index.json')) &&
    (fs.existsSync(path.join(root, 'state_tests')) ||
      fs.existsSync(path.join(root, 'blockchain_tests')))
  if (ready) return root
  if (options.skipFetch === true) {
    throw new Error(estFixturesCacheHint(sourceName))
  }
  if (options.autoFetch === true) {
    const { fetchReleaseSource } = await import('./fetchFixtures.ts')
    return fetchReleaseSource(sourceName)
  }
  throw new Error(estFixturesCacheHint(sourceName))
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
  const shard = parseShard(options.shard)
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

  const root = await resolveEstRoot(options.source, options)
  const formats: ConsensusFixtureFormat[] =
    options.format === 'all' ? ['state_tests', 'blockchain_tests'] : [options.format]

  let cases: ConsensusTestCase[] = []
  for (const format of formats) {
    cases = cases.concat(loadEstFixtures(root, format, shard))
  }
  cases = applyFilters(cases, options, forkFilter)
  return { cases, rootLabel: `${options.source}:${root}` }
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
