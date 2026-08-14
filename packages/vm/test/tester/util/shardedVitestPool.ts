/**
 * Hash-shard a Vitest spec across worker processes.
 * Workers only parse their fixture files; the parent merges one summary table.
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { availableParallelism, tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { type RunSummary, mergeRunSummaries, renderRunSummary } from './perDirectoryReporter.ts'

export const DEFAULT_MAX_JOBS = 4

const packageRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..', '..')

const REPORTER = './test/tester/util/perDirectoryReporter.ts'

export function defaultJobCount(): number {
  return Math.max(1, Math.min(DEFAULT_MAX_JOBS, availableParallelism()))
}

export function parseJobs(value: unknown): number {
  if (value === undefined) return defaultJobCount()
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid --jobs=${value}`)
  }
  return n
}

export type RunShardedVitestOpts = {
  spec: string
  jobs: number
  env: NodeJS.ProcessEnv
  summaryLabel: string
  /** Extra Vitest args for a single-process run (`jobs === 1`). */
  singleProcessArgs?: string[]
  /** Worker env key for writing runner-side check counts (legacy). */
  workerCountFileEnv?: string
  /** Write the merged per-directory summary JSON here after workers finish. */
  mergedSummaryJSON?: string
}

export type RunShardedVitestResult = {
  code: number
  merged: RunSummary
  shardCounts: number[]
}

function spawnVitest(
  spec: string,
  env: NodeJS.ProcessEnv,
  extraArgs: string[],
  inheritStdio: boolean,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['vitest', 'run', spec, ...extraArgs], {
      cwd: packageRoot,
      env,
      stdio: inheritStdio ? 'inherit' : ['ignore', 'inherit', 'inherit'],
    })
    child.on('error', reject)
    child.on('close', (code) => resolve(code ?? 1))
  })
}

function readSummary(file: string): RunSummary | undefined {
  try {
    const raw = readFileSync(file, 'utf8')
    if (raw.trim().length === 0) return undefined
    return JSON.parse(raw) as RunSummary
  } catch {
    return undefined
  }
}

function readCount(file: string): number {
  try {
    const n = Number(readFileSync(file, 'utf8').trim())
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

function emptySummary(label: string): RunSummary {
  return { label, passed: 0, failed: 0, total: 0, directories: [], errors: [] }
}

export async function runShardedVitest(
  opts: RunShardedVitestOpts,
): Promise<RunShardedVitestResult> {
  const { spec, jobs, env, summaryLabel } = opts

  if (jobs === 1) {
    const code = await spawnVitest(spec, env, opts.singleProcessArgs ?? [], true)
    return { code, merged: emptySummary(summaryLabel), shardCounts: [] }
  }

  console.log(`Using ${jobs} workers (hash-sharded fixture files). Pass --jobs=N to override.`)
  const tmp = mkdtempSync(path.join(tmpdir(), 'sharded-vitest-'))
  const started = Date.now()
  let code = 1
  let merged = emptySummary(summaryLabel)
  let shardCounts: number[] = []
  try {
    const codes = await Promise.all(
      Array.from({ length: jobs }, (_, index) => {
        const summaryPath = path.join(tmp, `shard-${index}.json`)
        const workerEnv: NodeJS.ProcessEnv = {
          ...env,
          TEST_SHARD: `${index}/${jobs}`,
          EST_SUMMARY_JSON: summaryPath,
          EST_SUMMARY_QUIET: '1',
          PRINT_TEST_FAILURES: '1',
          LEGACY_PRINT_FAILURES: '1',
        }
        if (opts.workerCountFileEnv !== undefined) {
          workerEnv[opts.workerCountFileEnv] = path.join(tmp, `count-${index}.txt`)
        }
        console.log(`[shard ${index + 1}/${jobs}] starting`)
        return spawnVitest(spec, workerEnv, ['--silent', `--reporter=${REPORTER}`], false).then(
          (exit) => {
            console.log(`[shard ${index + 1}/${jobs}] finished (exit ${exit})`)
            return exit
          },
        )
      }),
    )

    const summaries = Array.from({ length: jobs }, (_, index) => {
      return readSummary(path.join(tmp, `shard-${index}.json`)) ?? emptySummary(summaryLabel)
    })
    merged = mergeRunSummaries(summaries)
    if (merged.label === 'tests') merged.label = summaryLabel
    process.stdout.write(renderRunSummary(merged))

    const elapsed = ((Date.now() - started) / 1000).toFixed(1)
    console.log(
      `${jobs} workers · ${merged.passed} passed · ${merged.failed} failed · ${merged.total} tests · ${elapsed}s`,
    )

    shardCounts = Array.from({ length: jobs }, (_, index) =>
      readCount(path.join(tmp, `count-${index}.txt`)),
    )

    if (opts.mergedSummaryJSON !== undefined && opts.mergedSummaryJSON.length > 0) {
      writeFileSync(opts.mergedSummaryJSON, `${JSON.stringify(merged, null, 2)}\n`)
      console.log(`Wrote EST summary JSON to ${opts.mergedSummaryJSON}`)
    }

    const failed = codes.some((exit) => exit !== 0) || merged.failed > 0
    code = failed ? 1 : 0
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
  return { code, merged, shardCounts }
}
