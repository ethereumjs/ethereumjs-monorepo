/**
 * Process pool for the legacy ethereum/tests Vitest wrappers.
 * Full-suite runs hash-shard fixture files across workers; filtered / debug
 * runs stay on a single process with the default Vitest reporter.
 */
import minimist from 'minimist'

import { parseJobs, runShardedVitest } from '../../util/shardedVitestPool.ts'
import { getExpectedTests } from '../config.ts'

export type LegacySuite = 'state' | 'blockchain'

const SPEC: Record<LegacySuite, string> = {
  state: 'test/tester/legacy/state.spec.ts',
  blockchain: 'test/tester/legacy/blockchain.spec.ts',
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
  if (argv.jobs !== undefined) return parseJobs(argv.jobs)
  return parseJobs(undefined)
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

export async function runLegacyVitest(suite: LegacySuite): Promise<void> {
  const argv = minimist(process.argv.slice(2))
  const env = applyCliEnv(argv)
  const spec = SPEC[suite]
  const fork = env.VITE_FORK ?? 'Prague'
  const jobs = resolveJobs(argv)
  const label = suite === 'state' ? 'GeneralStateTests' : 'BlockchainTests'

  console.log(`Running tests for fork: ${fork}`)
  const result = await runShardedVitest({
    spec,
    jobs,
    env,
    summaryLabel: label,
    workerCountFileEnv: 'VITE_SHARD_COUNT_FILE',
  })

  if (jobs > 1) {
    const verify =
      truthyFlag(argv['verify-test-amount-alltests']) ||
      truthyFlag(env.VITE_VERIFY_TEST_AMOUNT_ALL_TESTS)
    if (verify === true) {
      const expectedFromTable = getExpectedTests(fork, label)
      const expectedFromArg =
        argv['expected-test-amount'] !== undefined
          ? Number(argv['expected-test-amount'])
          : undefined
      const expected =
        expectedFromArg !== undefined && expectedFromArg > 0 ? expectedFromArg : expectedFromTable
      if (expected !== undefined) {
        const got = result.shardCounts.reduce((a, b) => a + b, 0)
        if (got < expected) {
          console.error(`expected ${expected} checks, got ${got}`)
          process.exit(1)
        }
      }
    }
  }

  process.exit(result.code)
}
