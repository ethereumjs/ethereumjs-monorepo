import type { Common } from '@ethereumjs/common'

import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import * as mcl from 'mcl-wasm'
import minimist from 'minimist'
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

const argv = minimist(process.argv.slice(2))

argv.fork = import.meta.env.VITE_FORK // use VITE_ as prefix for env arguments

const RUN_PROFILER: boolean = argv.profile ?? false
const FORK_CONFIG: string = argv.fork !== undefined ? argv.fork : DEFAULT_FORK_CONFIG
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

describe('GeneralStateTests', async () => {
  const dirs = getTestDirs(FORK_CONFIG_VM, 'GeneralStateTests')
  for (const dir of dirs) {
    await new Promise<void>((resolve, _) => {
      if (argv.customTestsPath !== undefined) {
        testGetterArgs.directory = argv.customTestsPath as string
      } else {
        const testDir = testGetterArgs.dir ?? ''
        const testsPath = testGetterArgs.testsPath ?? DEFAULT_TESTS_PATH
        testGetterArgs.directory = path.join(testsPath, dir, testDir)
      }
      getTestsFromArgs(
        dir,
        async (fileName: string, subDir: string, testName: string, testDataRaw: any) => {
          const runSkipped = testGetterArgs.runSkipped
          const inRunSkipped = runSkipped.includes(fileName)
          if (runSkipped.length === 0 || inRunSkipped === true) {
            it(`file: ${subDir} test: ${testName}`, async () => {
              await runStateTest(runnerArgs, testDataRaw, assert)
            }, 120000)
          }
        },
        testGetterArgs,
      )
        .then(() => {
          resolve()
        })
        .catch((error: string) => {
          assert.fail(error)
        })
    })
  }
})
