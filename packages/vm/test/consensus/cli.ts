import os from 'node:os'
import { parseArgs } from 'node:util'

import { parseForkPreset } from './forks.ts'
import { loadManifest, loadManifestForSource } from './manifest.ts'
import { type SkipCategory, parseSkipCategories } from './skips.ts'

export type ConsensusFormat = 'state' | 'blockchain' | 'all'

/** Long options accepted by {@link parseRunnerArgv} (`--name` or `--name=value`). */
const RUNNER_KNOWN_LONG_FLAGS = new Set([
  '--source',
  '--format',
  '--fork',
  '--forks',
  '--dir',
  '--file',
  '--test',
  '--grep',
  '--jobs',
  '--shard',
  '--list',
  '--bail',
  '--skip',
  '--run-skipped',
  '--report',
  '--rerun-failed',
  '--fixture-root',
  '--skip-fetch',
  '--auto-fetch',
  '--jsontrace',
  '--debug',
  '--profile',
  '--legacy-fork',
])

function flagNameFromArgvToken(arg: string): string | undefined {
  if (!arg.startsWith('--')) return undefined
  const eq = arg.indexOf('=')
  return eq === -1 ? arg : arg.slice(0, eq)
}

/** Warn on mistyped flags (e.g. Vitest `--grep`) before strict parsing runs. */
export function warnUnknownRunnerFlags(argv: string[]): void {
  const unknown = new Set<string>()
  for (const arg of argv) {
    const name = flagNameFromArgvToken(arg)
    if (name === undefined) continue
    if (!RUNNER_KNOWN_LONG_FLAGS.has(name)) unknown.add(name)
  }
  if (unknown.size === 0) return
  const list = [...unknown].sort().join(', ')
  process.stderr.write(
    `consensus runner: unknown option(s): ${list}. ` +
      `Filter cases with --test <substring> (Vitest-style --grep is accepted as an alias).\n`,
  )
}

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
  warnUnknownRunnerFlags(argv)

  let values: Record<string, unknown>
  try {
    ;({ values } = parseArgs({
      args: argv,
      options: {
        source: { type: 'string', default: 'tests' },
        format: { type: 'string', default: 'all' },
        fork: { type: 'string', multiple: true },
        forks: { type: 'string' },
        dir: { type: 'string' },
        file: { type: 'string' },
        test: { type: 'string' },
        grep: { type: 'string' },
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
      strict: true,
      allowPositionals: true,
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(
      `${msg}\n` +
        `consensus runner flags: --test <substring> filters case ids; --grep is the same alias. ` +
        `See packages/vm/DEVELOPER.md § Execution-spec tests.`,
    )
  }

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

  const sourceName = String(values.source ?? 'tests')
  const manifest = sourceName === 'legacy' ? loadManifest() : loadManifestForSource(sourceName)
  const source = manifest.sources[sourceName]
  let forkFilter = parseForkPreset(forkPreset, forkArgs)
  if (source?.kind === 'release' && source.defaultForks !== undefined && forkArgs.length === 0) {
    if (forkPreset === undefined && sourceName !== 'tests') {
      forkFilter = new Set(source.defaultForks)
    }
  }

  const jobs = Math.max(1, Number(values.jobs ?? 1))

  const testFilter = values.test as string | undefined
  const grepFilter = values.grep as string | undefined
  if (grepFilter !== undefined) {
    process.stderr.write('consensus runner: --grep is an alias for --test\n')
  }
  let test: string | undefined = testFilter ?? grepFilter
  if (testFilter !== undefined && grepFilter !== undefined && testFilter !== grepFilter) {
    throw new Error('Cannot combine --test and --grep with different values')
  }

  return {
    source: sourceName,
    format,
    forkPreset,
    forkFilter,
    legacyFork,
    dir: values.dir as string | undefined,
    file: values.file as string | undefined,
    test,
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
