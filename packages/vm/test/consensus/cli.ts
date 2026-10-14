import os from 'node:os'
import { parseArgs } from 'node:util'

import { parseForkPreset } from './forks.ts'
import { loadManifest } from './manifest.ts'
import { type SkipCategory, parseSkipCategories } from './skips.ts'

export type ConsensusFormat = 'state' | 'blockchain' | 'all'

export type RunnerCliOptions = {
  source: string
  format: 'state_tests' | 'blockchain_tests' | 'all'
  forkPreset?: 'recent' | 'all'
  forkFilter?: Set<string>
  legacyFork?: string
  dir?: string
  file?: string
  test?: string
  jobs: number
  shard?: string
  list: boolean
  bail: boolean
  skipCategories: Set<SkipCategory>
  runSkippedCategories: Set<SkipCategory>
  reportPath?: string
  rerunFailedPath?: string
  fixtureRoot?: string
  skipFetch: boolean
  autoFetch: boolean
  jsontrace: boolean
  debug: boolean
  profile: boolean
}

export function parseRunnerArgv(argv: string[]): RunnerCliOptions {
  const { values } = parseArgs({
    args: argv,
    options: {
      source: { type: 'string', default: 'tests' },
      format: { type: 'string', default: 'all' },
      fork: { type: 'string', multiple: true },
      forks: { type: 'string' },
      dir: { type: 'string' },
      file: { type: 'string' },
      test: { type: 'string' },
      jobs: { type: 'string', default: String(Math.max(1, os.cpus().length)) },
      shard: { type: 'string' },
      list: { type: 'boolean', default: false },
      bail: { type: 'boolean', default: false },
      skip: { type: 'string' },
      'run-skipped': { type: 'string' },
      report: { type: 'string' },
      'rerun-failed': { type: 'string' },
      'fixture-root': { type: 'string' },
      'skip-fetch': { type: 'boolean', default: false },
      'auto-fetch': { type: 'boolean', default: false },
      jsontrace: { type: 'boolean', default: false },
      debug: { type: 'boolean', default: false },
      profile: { type: 'boolean', default: false },
      'legacy-fork': { type: 'string' },
    },
    strict: false,
    allowPositionals: true,
  })

  const formatRaw = String(values.format ?? 'all').toLowerCase()
  let format: RunnerCliOptions['format'] = 'all'
  if (formatRaw === 'state') format = 'state_tests'
  else if (formatRaw === 'blockchain') format = 'blockchain_tests'
  else if (formatRaw === 'state_tests' || formatRaw === 'blockchain_tests' || formatRaw === 'all') {
    format = formatRaw as RunnerCliOptions['format']
  }

  const forkArgs = (values.fork as string[] | undefined) ?? []
  const legacyFork = (values['legacy-fork'] as string | undefined) ?? forkArgs[0]
  const forksPreset = values.forks as string | undefined
  let forkPreset: 'recent' | 'all' | undefined
  if (forksPreset === 'recent' || forksPreset === 'all') forkPreset = forksPreset

  const manifest = loadManifest()
  const sourceName = String(values.source ?? 'tests')
  const source = manifest.sources[sourceName]
  let forkFilter = parseForkPreset(forkPreset, forkArgs)
  if (source?.kind === 'release' && source.defaultForks !== undefined && forkArgs.length === 0) {
    if (forkPreset === undefined && sourceName !== 'tests') {
      forkFilter = new Set(source.defaultForks)
    }
  }

  const jobs = Math.max(1, Number(values.jobs ?? 1))

  return {
    source: sourceName,
    format,
    forkPreset,
    forkFilter,
    legacyFork,
    dir: values.dir as string | undefined,
    file: values.file as string | undefined,
    test: values.test as string | undefined,
    jobs,
    shard: values.shard as string | undefined,
    list: values.list === true,
    bail: values.bail === true,
    skipCategories: parseSkipCategories(values.skip as string | undefined),
    runSkippedCategories: parseSkipCategories(values['run-skipped'] as string | undefined),
    reportPath: values.report as string | undefined,
    rerunFailedPath: values['rerun-failed'] as string | undefined,
    fixtureRoot: values['fixture-root'] as string | undefined,
    skipFetch: values['skip-fetch'] === true,
    autoFetch: values['auto-fetch'] === true,
    jsontrace: values.jsontrace === true,
    debug: values.debug === true,
    profile: values.profile === true,
  }
}
