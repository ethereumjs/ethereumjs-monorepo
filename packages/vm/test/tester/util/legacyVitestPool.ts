/**
 * Process pool for the legacy ethereum/tests Vitest wrappers.
 * Full-suite runs hash-shard fixture files across workers; filtered / debug
 * runs stay on a single process with the default Vitest reporter.
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { availableParallelism, tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'

import { getExpectedTests } from '../config.ts'
import { type RunSummary, mergeRunSummaries, renderRunSummary } from './perDirectoryReporter.ts'

const DEFAULT_MAX_JOBS = 4
const packageRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..', '..')

export type LegacySuite = 'state' | 'blockchain'

const SPEC: Record<LegacySuite, string> = {
  state: 'test/tester/state.spec.ts',
  blockchain: 'test/tester/blockchain.spec.ts',
}

function setEnv(env: NodeJS.ProcessEnv, key: string, value: unknown) {
  if (value !== undefined) env[key] = String(value)
}

function truthyFlag(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true'
}

function forceSingleProcess(argv: minimist.ParsedArgs): boolean {
  return (
    argv.test !== undefined ||
    argv.file !== undefined ||
    argv.customStateTest !== undefined ||
    argv.jsontrace === true ||
    argv.debug === true ||
    argv.profile === true
  )
}

function resolveJobs(argv: minimist.ParsedArgs): number {
  if (forceSingleProcess(argv)) return 1
  if (argv.jobs !== undefined) {
    const n = Number(argv.jobs)
    if (!Number.isInteger(n) || n < 1) {
      throw new Error(`Invalid --jobs=${argv.jobs}`)
    }
    return n
  }
  return Math.max(1, Math.min(DEFAULT_MAX_JOBS, availableParallelism()))
}

function applyCliEnv(argv: minimist.ParsedArgs): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env }
  setEnv(env, 'VITE_FORK', argv.fork ?? env.VITE_FORK ?? 'Prague')
  setEnv(env, 'VITE_TEST', argv.test)
  setEnv(env, 'VITE_FILE', argv.file)
  setEnv(env, 'VITE_DIR', argv.dir)
  setEnv(env, 'VITE_EXCLUDE_DIR', argv.excludeDir)
  setEnv(env, 'VITE_TESTS_PATH', argv.testsPath)
  setEnv(env, 'VITE_CUSTOM_STATE_TEST', argv.customStateTest)
  setEnv(env, 'VITE_CUSTOM_TESTS_PATH', argv.customTestsPath)
  setEnv(env, 'VITE_DIRECTORY', argv.directory)
  setEnv(env, 'VITE_SKIP', argv.skip)
  setEnv(env, 'VITE_SKIP_TESTS', argv.skipTests)
  setEnv(env, 'VITE_RUN_SKIPPED', argv.runSkipped)
  setEnv(env, 'VITE_DATA', argv.data)
  setEnv(env, 'VITE_GAS', argv.gas)
  setEnv(env, 'VITE_VALUE', argv.value)
  setEnv(env, 'VITE_REPS', argv.reps)
  setEnv(env, 'VITE_BLS', argv.bls)
  setEnv(env, 'VITE_BN254', argv.bn254)
  setEnv(env, 'VITE_STATE_MANAGER', argv.stateManager)
  setEnv(env, 'VITE_FORK_CONFIG', argv.forkConfig)
  setEnv(env, 'VITE_VERIFY_TEST_AMOUNT_ALL_TESTS', argv['verify-test-amount-alltests'])
  setEnv(env, 'VITE_EXPECTED_TEST_AMOUNT', argv['expected-test-amount'])
  if (argv.jsontrace === true) setEnv(env, 'VITE_JSONTRACE', 'true')
  if (argv.dist === true) setEnv(env, 'VITE_DIST', 'true')
  if (argv.debug === true) setEnv(env, 'VITE_DEBUG', 'true')
  if (argv.profile === true) setEnv(env, 'VITE_PROFILE', 'true')
  return env
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

export async function runLegacyVitest(suite: LegacySuite): Promise<void> {
  const argv = minimist(process.argv.slice(2))
  const env = applyCliEnv(argv)
  const spec = SPEC[suite]
  const fork = env.VITE_FORK ?? 'Prague'
  const jobs = resolveJobs(argv)

  console.log(`Running tests for fork: ${fork}`)
  if (jobs === 1) {
    const code = await spawnVitest(spec, env, [], true)
    process.exit(code)
  }

  console.log(`Using ${jobs} workers (hash-sharded fixture files). Pass --jobs=N to override.`)
  const tmp = mkdtempSync(path.join(tmpdir(), 'legacy-vitest-'))
  const started = Date.now()
  let exitCode = 1
  try {
    const codes = await Promise.all(
      Array.from({ length: jobs }, (_, index) => {
        const summaryPath = path.join(tmp, `shard-${index}.json`)
        const countPath = path.join(tmp, `count-${index}.txt`)
        const workerEnv: NodeJS.ProcessEnv = {
          ...env,
          VITE_SHARD: `${index}/${jobs}`,
          EST_SUMMARY_JSON: summaryPath,
          EST_SUMMARY_QUIET: '1',
          LEGACY_PRINT_FAILURES: '1',
          VITE_SHARD_COUNT_FILE: countPath,
        }
        console.log(`[shard ${index + 1}/${jobs}] starting`)
        return spawnVitest(
          spec,
          workerEnv,
          ['--silent', '--reporter=./test/tester/util/perDirectoryReporter.ts'],
          false,
        ).then((code) => {
          console.log(`[shard ${index + 1}/${jobs}] finished (exit ${code})`)
          return code
        })
      }),
    )

    const summaries = Array.from({ length: jobs }, (_, index) => {
      return readSummary(path.join(tmp, `shard-${index}.json`)) ?? emptySummary(suite)
    })
    const merged = mergeRunSummaries(summaries)
    const label = suite === 'state' ? 'GeneralStateTests' : 'BlockchainTests'
    merged.label = merged.label === 'tests' ? label : merged.label
    process.stdout.write(renderRunSummary(merged))

    const elapsed = ((Date.now() - started) / 1000).toFixed(1)
    console.log(
      `${jobs} workers · ${merged.passed} passed · ${merged.failed} failed · ${merged.total} tests · ${elapsed}s`,
    )

    const verify =
      truthyFlag(argv['verify-test-amount-alltests']) ||
      truthyFlag(env.VITE_VERIFY_TEST_AMOUNT_ALL_TESTS)
    if (verify === true) {
      const expectedFromTable = getExpectedTests(
        fork,
        suite === 'state' ? 'GeneralStateTests' : 'BlockchainTests',
      )
      const expectedFromArg =
        argv['expected-test-amount'] !== undefined
          ? Number(argv['expected-test-amount'])
          : undefined
      const expected =
        expectedFromArg !== undefined && expectedFromArg > 0 ? expectedFromArg : expectedFromTable
      if (expected !== undefined) {
        const got = Array.from({ length: jobs }, (_, index) =>
          readCount(path.join(tmp, `count-${index}.txt`)),
        ).reduce((a, b) => a + b, 0)
        if (got < expected) {
          console.error(`expected ${expected} checks, got ${got}`)
          exitCode = 1
          return
        }
      }
    }

    const failed = codes.some((code) => code !== 0) || merged.failed > 0
    exitCode = failed ? 1 : 0
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
  process.exit(exitCode)
}
