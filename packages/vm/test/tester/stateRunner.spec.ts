import type { Common } from '@ethereumjs/common'

import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import * as mcl from 'mcl-wasm'
import { assert, describe, it } from 'vitest'

import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

import path from 'path'
import {
  type EVMBLSInterface,
  type EVMBN254Interface,
  MCLBLS,
  NobleBLS,
  NobleBN254,
  RustBN254,
} from '@ethereumjs/evm'
import { initRustBN } from 'rustbn-wasm'
import {
  DEFAULT_FORK_CONFIG,
  DEFAULT_TESTS_PATH,
  getCommon,
  getRequiredForkConfigAlias,
  getSkipTests,
  getTestDirs,
} from './config.ts'
import { runStateTest } from './runners/GeneralStateTestsRunner.ts'
import { getTestsFromArgs } from './testLoader.ts'

// use VITE_ as prefix for env arguments
const argv: {
  fork?: string
  bls?: string
  bn254?: string
  stateManager?: string
  forkConfig?: string
  file?: string
  test?: string
  dir?: string
  excludeDir?: string
  testsPath?: string
  customStateTest?: string
  directory?: string
  skip?: string
  skipTests?: string[]
  runSkipped?: string[]
  data?: number
  gas?: number
  value?: number
  reps?: number
  verifyTestAmountAllTests?: number
  expectedTestAmount?: number
  debug?: boolean
  profile?: boolean
  jsontrace?: boolean
  dist?: boolean
} = {
  // string flags
  fork: import.meta.env.VITE_FORK,
  bls: import.meta.env.VITE_BLS,
  bn254: import.meta.env.VITE_BN254,
  stateManager: import.meta.env.VITE_STATE_MANAGER,
  forkConfig: import.meta.env.VITE_FORK_CONFIG,
  file: import.meta.env.VITE_FILE,
  test: import.meta.env.VITE_TEST,
  dir: import.meta.env.VITE_DIR,
  excludeDir: import.meta.env.VITE_EXCLUDE_DIR,
  testsPath: import.meta.env.VITE_TESTS_PATH,
  customStateTest: import.meta.env.VITE_CUSTOM_STATE_TEST,
  directory: import.meta.env.VITE_DIRECTORY,
  skip: import.meta.env.VITE_SKIP,

  // boolean flags
  jsontrace: import.meta.env.VITE_JSONTRACE === 'true',
  dist: import.meta.env.VITE_DIST === 'true',
  debug: import.meta.env.VITE_DEBUG === 'true',
  profile: import.meta.env.VITE_PROFILE === 'true',

  // numeric flags
  data: import.meta.env.VITE_DATA !== undefined ? Number(import.meta.env.VITE_DATA) : undefined,
  gas: import.meta.env.VITE_GAS !== undefined ? Number(import.meta.env.VITE_GAS) : undefined,
  value: import.meta.env.VITE_VALUE !== undefined ? Number(import.meta.env.VITE_VALUE) : undefined,
  reps: import.meta.env.VITE_REPS !== undefined ? Number(import.meta.env.VITE_REPS) : undefined,
  verifyTestAmountAllTests:
    import.meta.env.VITE_VERIFY_TEST_AMOUNT_ALL_TESTS !== undefined
      ? Number(import.meta.env.VITE_VERIFYTESTAMOUNTALLTESTS)
      : undefined,
  expectedTestAmount:
    import.meta.env.VITE_EXPECTED_TEST_AMOUNT !== undefined
      ? Number(import.meta.env.VITE_EXPECTEDTESTAMOUNT)
      : undefined,

  // array flags
  skipTests: (import.meta.env.VITE_SKIP_TESTS as string)?.split(','),
  runSkipped: (import.meta.env.VITE_RUN_SKIPPED as string)?.split(','),
}

const RUN_PROFILER: boolean = argv.profile ?? false
const FORK_CONFIG: string = argv.fork ?? DEFAULT_FORK_CONFIG
const FORK_CONFIG_TEST_SUITE = getRequiredForkConfigAlias(FORK_CONFIG)

// Examples: Istanbul -> istanbul, MuirGlacier -> muirGlacier
const FORK_CONFIG_VM = FORK_CONFIG.charAt(0).toLowerCase() + FORK_CONFIG.substring(1)

let bls: EVMBLSInterface
if (argv.bls !== undefined && argv.bls.toLowerCase() === 'mcl') {
  await mcl.init(mcl.BLS12_381)
  bls = new MCLBLS(mcl)
  console.log('BLS library used: MCL (WASM)')
} else {
  console.log('BLS library used: Noble (JavaScript)')
  bls = new NobleBLS()
}

let bn254: EVMBN254Interface
if (argv.bn254 !== undefined && argv.bn254.toLowerCase() === 'mcl') {
  const rustBN = await initRustBN()
  bn254 = new RustBN254(rustBN)
  console.log('BN254 (alt_BN128) library used: rustbn.js (WASM)')
} else {
  console.log('BN254 (alt_BN128) library used: Noble (JavaScript)')
  bn254 = new NobleBN254()
}

const kzg = new microEthKZG(trustedSetup)
const runnerArgs: {
  forkConfigVM: string
  forkConfigTestSuite: string
  common: Common
  jsontrace?: boolean
  dist?: boolean
  data?: number
  gasLimit?: number
  value?: number
  debug?: boolean
  reps?: number
  profile: boolean
  bls: EVMBLSInterface
  bn254: EVMBN254Interface
  stateManager: string
} = {
  forkConfigVM: FORK_CONFIG_VM,
  forkConfigTestSuite: FORK_CONFIG_TEST_SUITE,
  common: getCommon(FORK_CONFIG_VM, kzg),
  jsontrace: argv.jsontrace,
  dist: argv.dist,
  data: argv.data, // GeneralStateTests
  gasLimit: argv.gas, // GeneralStateTests
  value: argv.value, // GeneralStateTests
  debug: argv.debug, // BlockchainTests
  reps: argv.reps, // test repetitions
  bls,
  profile: RUN_PROFILER,
  bn254,
  stateManager: argv.stateManager,
}

/**
 * Configuration for getting the tests from the ethereum/tests repository
 */
const testGetterArgs: {
  skipTests: string[]
  runSkipped: string[]
  forkConfig: string
  file?: string
  test?: string
  dir?: string
  excludeDir?: string
  testsPath?: string
  customStateTest?: string
  directory?: string
} = {
  skipTests: getSkipTests(argv.skip, argv.runSkipped !== undefined ? 'NONE' : 'ALL'),
  runSkipped: getSkipTests(argv.runSkipped, 'NONE'),
  forkConfig: FORK_CONFIG_TEST_SUITE,
  file: argv.file,
  test: argv.test,
  dir: argv.dir,
  excludeDir: argv.excludeDir,
  testsPath: argv.testsPath,
  customStateTest: argv.customStateTest,
}

interface LoadedTest {
  dir: string
  fileName: string
  subDir: string
  testName: string
  testData: any
}
const allTests: LoadedTest[] = []
const dirs = getTestDirs(FORK_CONFIG_VM, 'GeneralStateTests')
for (const dir of dirs) {
  if (argv.customTestsPath !== undefined) {
    testGetterArgs.directory = argv.customTestsPath as string
  } else {
    const testDir = testGetterArgs.dir ?? ''
    const testsPath = testGetterArgs.testsPath ?? DEFAULT_TESTS_PATH
    testGetterArgs.directory = path.join(testsPath, dir, testDir)
  }

  const tests: LoadedTest[] = []
  try {
    await getTestsFromArgs(
      dir,
      async (fileName: string, subDir: string, testName: string, testData: any) => {
        const runSkipped = testGetterArgs.runSkipped
        const inRunSkipped = runSkipped.includes(fileName)
        if (runSkipped.length === 0 || inRunSkipped === true) {
          tests.push({ dir, fileName, subDir, testName, testData })
        }
      },
      testGetterArgs,
    )
  } catch (e) {
    console.log(e) // TODO failing to discover LegacyTests paths that are hardcoded in getTestDirs
    continue
  }

  allTests.push(...tests)
}

describe('GeneralStateTests', () => {
  for (const { subDir, testName, testData } of allTests) {
    it(`file: ${subDir} test: ${testName}`, async () => {
      await runStateTest(runnerArgs, testData, assert)
    }, 120000)
  }
})
