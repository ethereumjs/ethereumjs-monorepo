/**
 * Hash-shards EST fixture files across worker processes.
 * TEST_FILE / TEST_CASE stay single-process with the default Vitest reporter.
 */
import minimist from 'minimist'

import { defaultJobCount, parseJobs, runShardedVitest } from './util/shardedVitestPool.ts'

const REPORTER = './test/tester/util/perDirectoryReporter.ts'

type EstSuite = 'state' | 'blockchain'

const SPEC: Record<EstSuite, string> = {
  state: 'test/tester/executionSpecState.test.ts',
  blockchain: 'test/tester/executionSpecBlockchain.test.ts',
}

function isSuite(value: string | undefined): value is EstSuite {
  return value === 'state' || value === 'blockchain'
}

function forceSingleProcess(): boolean {
  return (
    (process.env.TEST_FILE !== undefined && process.env.TEST_FILE.length > 0) ||
    (process.env.TEST_CASE !== undefined && process.env.TEST_CASE.length > 0)
  )
}

function resolveJobs(argv: minimist.ParsedArgs): number {
  if (forceSingleProcess()) return 1
  if (argv.jobs !== undefined) return parseJobs(argv.jobs)
  if (process.env.EST_JOBS !== undefined && process.env.EST_JOBS.length > 0) {
    return parseJobs(process.env.EST_JOBS)
  }
  return defaultJobCount()
}

function singleProcessArgs(): string[] {
  const summaryOnly =
    process.env.EST_SUMMARY_JSON !== undefined &&
    process.env.EST_SUMMARY_JSON.length > 0 &&
    forceSingleProcess() === false
  if (summaryOnly) {
    return [`--reporter=${REPORTER}`]
  }
  return ['--reporter=default', `--reporter=${REPORTER}`]
}

const suiteArg = process.argv[2]
if (isSuite(suiteArg) === false) {
  console.error('Usage: tsx ./test/tester/est-wrapper.ts state|blockchain [--jobs=N]')
  process.exit(1)
}

const argv = minimist(process.argv.slice(3))
const jobs = resolveJobs(argv)
const mergedSummaryJSON = process.env.EST_SUMMARY_JSON
const label = suiteArg === 'state' ? 'state tests' : 'blockchain tests'
const fixturesPath = process.env.TEST_PATH ?? '../execution-spec-tests'

console.log(`Running EST ${suiteArg} tests from: ${fixturesPath}`)

const result = await runShardedVitest({
  spec: SPEC[suiteArg],
  jobs,
  env: process.env,
  summaryLabel: label,
  singleProcessArgs: singleProcessArgs(),
  mergedSummaryJSON,
})

process.exit(result.code)
