/**
 * This file is deprecated.
 *
 * The new runner in executionSpecBlockchain.test.ts will become the main
 * entry point for blockchain tests.
 *
 * If you discover functionality here which is still missing in the new runner,
 * please open a PR against executionSpecBlockchain.test.ts.
 *
 * PLEASE DO NOT COPY LARGER PARTS OF THE CODE TO THE NEW RUNNER BUT RE-IMPLEMENT
 * (USE COMMON SENSE).
 */
import { type Common, ConsensusAlgorithm } from '@ethereumjs/common'

import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import * as mcl from 'mcl-wasm'
import { assert, afterAll, describe, it } from 'vitest'

import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

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
  getExpectedTests,
  getRequiredForkConfigAlias,
  getSkipTests,
  getTestDirs,
} from './config.ts'
import { runBlockchainTest } from './runners/BlockchainTestsRunner.ts'
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
  customTestsPath?: string
  skip?: string
  skipTests?: string
  runSkipped?: string
  verifyTestAmountAllTests?: number
  expectedTestAmount?: number
  debug?: boolean
  profile?: boolean
  dist?: boolean
} = {
  // string flags
  fork: process.env.VITE_FORK,
  bls: process.env.VITE_BLS,
  bn254: process.env.VITE_BN254,
  stateManager: process.env.VITE_STATE_MANAGER,
  forkConfig: process.env.VITE_FORK_CONFIG,
  file: process.env.VITE_FILE,
  test: process.env.VITE_TEST,
  dir: process.env.VITE_DIR,
  excludeDir: process.env.VITE_EXCLUDE_DIR,
  testsPath: process.env.VITE_TESTS_PATH,
  customTestsPath: process.env.VITE_CUSTOM_TESTS_PATH,
  skip: process.env.VITE_SKIP,

  // boolean flags
  dist: process.env.VITE_DIST === 'true',
  debug: process.env.VITE_DEBUG === 'true',
  profile: process.env.VITE_PROFILE === 'true',

  // numeric flags
  verifyTestAmountAllTests:
    process.env.VITE_VERIFY_TEST_AMOUNT_ALL_TESTS !== undefined
      ? Number(process.env.VITE_VERIFY_TEST_AMOUNT_ALL_TESTS)
      : undefined,
  expectedTestAmount:
    process.env.VITE_EXPECTED_TEST_AMOUNT !== undefined
      ? Number(process.env.VITE_EXPECTED_TEST_AMOUNT)
      : undefined,

  // array flags
  skipTests: process.env.VITE_SKIP_TESTS,
  runSkipped: process.env.VITE_RUN_SKIPPED,
}

const RUN_PROFILER: boolean = argv.profile ?? false
const FORK_CONFIG: string = argv.fork ?? DEFAULT_FORK_CONFIG
const FORK_CONFIG_TEST_SUITE = getRequiredForkConfigAlias(FORK_CONFIG)

console.log(`Running tests for fork: ${FORK_CONFIG}`)

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
  dist?: boolean
  debug?: boolean
  profile: boolean
  bls: EVMBLSInterface
  bn254: EVMBN254Interface
  stateManager?: string
  testCount: number
} = {
  forkConfigVM: FORK_CONFIG_VM,
  forkConfigTestSuite: FORK_CONFIG_TEST_SUITE,
  common: getCommon(FORK_CONFIG_VM, kzg),
  dist: argv.dist,
  debug: argv.debug,
  bls,
  profile: RUN_PROFILER,
  bn254,
  stateManager: argv.stateManager,
  testCount: 0,
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
}

interface LoadedTest {
  dir: string
  fileName: string
  subDir: string
  testName: string
  testData: any
}
const allTests: LoadedTest[] = []
const dirs = getTestDirs(FORK_CONFIG_VM, 'BlockchainTests')
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
  } catch {
    continue
  }

  allTests.push(...tests)
}

const filteredTests = allTests.filter(({ testData }) => {
  if (
    testData.sealEngine === 'Ethash' &&
    runnerArgs.common.consensusAlgorithm() !== ConsensusAlgorithm.Ethash
  ) {
    return false
  }
  return true
})

const expectedTests: number | undefined =
  argv.verifyTestAmountAllTests !== undefined && argv.verifyTestAmountAllTests > 0
    ? getExpectedTests(FORK_CONFIG_VM, 'BlockchainTests')
    : argv.expectedTestAmount !== undefined && argv.expectedTestAmount > 0
      ? argv.expectedTestAmount
      : undefined

describe('BlockchainTests', () => {
  if (filteredTests.length === 0) {
    it.skip(`no BlockchainTests found for fork ${FORK_CONFIG_TEST_SUITE}, skipping suite`, () => {})
    return
  }

  for (const { subDir, testName, testData } of filteredTests) {
    it(`file: ${subDir} test: ${testName}`, async () => {
      try {
        await runBlockchainTest(runnerArgs, testData, assert)
      } catch (e: any) {
        assert.fail(e?.toString())
      }
    }, 120000)
  }

  afterAll(() => {
    if (expectedTests !== undefined) {
      assert.isTrue(
        runnerArgs.testCount >= expectedTests,
        `expected ${expectedTests} checks, got ${runnerArgs.testCount}`,
      )
    }
  })
})
