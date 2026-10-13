import { parseArgs } from 'node:util'

import type { T8NOptions } from '../../t8n/types.ts'

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

const t8nCliOptions = {
  'state.fork': { type: 'string' },
  'state.chainid': { type: 'string', default: '1' },
  'state.reward': { type: 'string', default: '-1' },
  'input.alloc': { type: 'string' },
  'input.txs': { type: 'string' },
  'input.env': { type: 'string' },
  'output.basedir': { type: 'string' },
  'output.result': { type: 'string' },
  'output.alloc': { type: 'string' },
  'output.body': { type: 'string' },
  log: { type: 'boolean', default: false },
  trace: { type: 'boolean', default: false },
} as const

const t8nRequiredKeys = [
  'state.fork',
  'input.alloc',
  'input.txs',
  'input.env',
  'output.basedir',
  'output.result',
  'output.alloc',
] as const

export function parseT8nArgv(args: string[]): T8NOptions {
  const { values } = parseArgs({
    args,
    options: t8nCliOptions,
    strict: true,
  })

  for (const key of t8nRequiredKeys) {
    const value = values[key]
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(`Missing required option: --${key}`)
    }
  }

  const chainid = (values['state.chainid'] as string | undefined) ?? '1'
  const reward = (values['state.reward'] as string | undefined) ?? '-1'

  return {
    state: {
      fork: values['state.fork'] as string,
      chainid: BigInt(chainid),
      reward: BigInt(reward),
    },
    input: {
      alloc: values['input.alloc'] as string,
      txs: values['input.txs'] as string,
      env: values['input.env'] as string,
    },
    output: {
      basedir: values['output.basedir'] as string,
      result: values['output.result'] as string,
      alloc: values['output.alloc'] as string,
    },
    log: values.log === true,
    trace: values.trace === true,
  }
}
