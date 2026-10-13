import { parseArgs } from 'node:util'

/** Parsed legacy ethereum/tests Vitest wrapper flags (formerly minimist). */
export type LegacyVitestArgv = {
  fork?: string
  test?: string
  file?: string
  dir?: string
  excludeDir?: string
  testsPath?: string
  customStateTest?: string
  customTestsPath?: string
  directory?: string
  skip?: string
  skipTests?: string
  runSkipped?: string
  data?: string
  gas?: string
  value?: string
  reps?: string
  bls?: string
  bn254?: string
  stateManager?: string
  forkConfig?: string
  jobs?: string
  'verify-test-amount-alltests'?: string
  'expected-test-amount'?: string
  jsontrace?: boolean
  dist?: boolean
  debug?: boolean
  profile?: boolean
}

const legacyVitestOptions = {
  fork: { type: 'string' },
  test: { type: 'string' },
  file: { type: 'string' },
  dir: { type: 'string' },
  excludeDir: { type: 'string' },
  testsPath: { type: 'string' },
  customStateTest: { type: 'string' },
  customTestsPath: { type: 'string' },
  directory: { type: 'string' },
  skip: { type: 'string' },
  skipTests: { type: 'string' },
  runSkipped: { type: 'string' },
  data: { type: 'string' },
  gas: { type: 'string' },
  value: { type: 'string' },
  reps: { type: 'string' },
  bls: { type: 'string' },
  bn254: { type: 'string' },
  stateManager: { type: 'string' },
  forkConfig: { type: 'string' },
  jobs: { type: 'string' },
  'verify-test-amount-alltests': { type: 'string' },
  'expected-test-amount': { type: 'string' },
  jsontrace: { type: 'boolean' },
  dist: { type: 'boolean' },
  debug: { type: 'boolean' },
  profile: { type: 'boolean' },
} as const

export function parseLegacyVitestArgv(args: string[]): LegacyVitestArgv {
  const { values } = parseArgs({
    args,
    options: legacyVitestOptions,
    strict: false,
  })
  return values as LegacyVitestArgv
}

export function parseEstWrapperArgv(args: string[]): { jobs?: string } {
  const { values } = parseArgs({
    args,
    options: { jobs: { type: 'string' } },
    strict: false,
  })
  return { jobs: values.jobs as string | undefined }
}
