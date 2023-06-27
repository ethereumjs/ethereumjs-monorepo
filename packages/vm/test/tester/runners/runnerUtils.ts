import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Trie } from '@ethereumjs/trie'
import { Account, Address } from '@ethereumjs/util'
import * as path from 'path'

import { VM } from '../../../src'
import { makeTx, setupPreConditions } from '../../util'
import { DEFAULT_TESTS_PATH, getCommon, getExpectedTests, getSkipTests } from '../config'

import type { Common } from '@ethereumjs/common'
import type {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
} from '@ethereumjs/tx'

export interface TestArgs {
  state?: boolean
  blockchain?: boolean
  fork?: string
  skip: string
  runSkipped: string
  file?: string
  test?: string
  dir?: string
  excludeDir?: string
  testsPath?: string
  customTestsPath?: string
  customStateTest?: string
  jsontrace?: boolean
  dist?: boolean
  data?: number
  gas?: number
  value?: number
  debug?: boolean
  'expected-test-amount'?: number
  'verify-test-amount-alltests': number
  reps?: number
}

export interface TestGetterArgs {
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
}

export interface RunnerArgs {
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
}

export function getStateTests(
  FORK_CONFIG_VM: string,
  allTests: number,
  expectedTestAmount?: number
) {
  const expectedTests: number | undefined =
    allTests > 0
      ? getExpectedTests(FORK_CONFIG_VM, 'GeneralStateTests')
      : expectedTestAmount !== undefined && expectedTestAmount > 0
      ? expectedTestAmount
      : undefined
  return expectedTests
}
export function getBlockchainTests(argv: any, FORK_CONFIG_VM: string) {
  const expectedTests: number | undefined =
    argv['verify-test-amount-alltests'] > 0
      ? getExpectedTests(FORK_CONFIG_VM, 'BlockchainTests')
      : argv['expected-test-amount'] !== undefined && argv['expected-test-amount'] > 0
      ? argv['expected-test-amount']
      : undefined
  return expectedTests
}

export function getTestPath(dir: any, testGetterArgs: TestGetterArgs, customTestsPath?: string) {
  if (customTestsPath !== undefined) {
    return customTestsPath as string
  } else {
    const testDir = testGetterArgs.dir ?? ''
    const testsPath = testGetterArgs.testsPath ?? DEFAULT_TESTS_PATH
    return path.join(testsPath, dir, testDir)
  }
}

export function shouldSkip(runSkipped: string[], fileName: string) {
  if (runSkipped.length === 0) {
    return false
  }
  if (runSkipped.includes(fileName)) {
    return false
  }
  return true
}

export const getGetterArgs = (argv: any, FORK_CONFIG_TEST_SUITE: string): TestGetterArgs => {
  return {
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
}

export const getRunnerArgs = (
  argv: any,
  FORK_CONFIG_VM: string,
  FORK_CONFIG_TEST_SUITE: string
): RunnerArgs => {
  return {
    forkConfigVM: FORK_CONFIG_VM,
    forkConfigTestSuite: FORK_CONFIG_TEST_SUITE,
    common: getCommon(FORK_CONFIG_VM),
    jsontrace: argv.jsontrace,
    dist: argv.dist,
    data: argv.data, // GeneralStateTests
    gasLimit: argv.gas, // GeneralStateTests
    value: argv.value, // GeneralStateTests
    debug: argv.debug, // BlockchainTests
    reps: argv.reps, // test repetitions
  }
}

export function parseTestCases(
  forkConfigTestSuite: string,
  testData: any,
  data: string | undefined,
  gasLimit: string | undefined,
  value: string | undefined
) {
  let testCases = []

  if (testData['post'][forkConfigTestSuite] !== undefined) {
    testCases = testData['post'][forkConfigTestSuite].map((testCase: any) => {
      const testIndexes = testCase['indexes']
      const tx = { ...testData.transaction }
      if (data !== undefined && testIndexes['data'] !== data) {
        return null
      }

      if (value !== undefined && testIndexes['value'] !== value) {
        return null
      }

      if (gasLimit !== undefined && testIndexes['gas'] !== gasLimit) {
        return null
      }

      tx.data = testData.transaction.data[testIndexes['data']]
      tx.gasLimit = testData.transaction.gasLimit[testIndexes['gas']]
      tx.value = testData.transaction.value[testIndexes['value']]

      if (tx.accessLists !== undefined) {
        tx.accessList = testData.transaction.accessLists[testIndexes['data']]
        if (tx.chainId === undefined) {
          tx.chainId = 1
        }
      }

      return {
        transaction: tx,
        postStateRoot: testCase['hash'],
        logs: testCase['logs'],
        env: testData['env'],
        pre: testData['pre'],
        expectException: testCase['expectException'],
      }
    })
  }

  testCases = testCases.filter((testCase: any) => {
    return testCase !== null
  })

  return testCases
}

export async function setupVM(
  common: Common,
  testData: any
): Promise<{
  vm: VM
  tx: LegacyTransaction | AccessListEIP2930Transaction | FeeMarketEIP1559Transaction | undefined
  execInfo: string
}> {
  // Have to create a blockchain with empty block as genesisBlock for Merge
  // Otherwise mainnet genesis will throw since this has difficulty nonzero
  const genesisBlock = new Block(undefined, undefined, undefined, undefined, { common })
  const blockchain = await Blockchain.create({ genesisBlock, common })
  const state = new Trie({ useKeyHashing: true })
  const stateManager = new DefaultStateManager({
    trie: state,
    common,
  })
  const vm = await VM.create({ stateManager, common, blockchain })
  await setupPreConditions(vm.stateManager, testData)
  let execInfo = ''
  let tx
  try {
    tx = makeTx(testData.transaction, { common })
  } catch (e: any) {
    execInfo = 'tx instantiation exception'
  }
  // Even if no txs are ran, coinbase should always be created
  const coinbaseAddress = Address.fromString(testData.env.currentCoinbase)
  const account = await (<VM>vm).stateManager.getAccount(coinbaseAddress)
  await (<VM>vm).evm.journal.putAccount(coinbaseAddress, account ?? new Account())
  return { vm, tx, execInfo }
}

export const defaultStateTestArgs: TestArgs = {
  state: true,
  skip: 'ALL',
  runSkipped: 'NONE',
  'verify-test-amount-alltests': 1,
}
export const defaultBlockchainTestArgs: TestArgs = {
  blockchain: true,
  skip: 'ALL',
  runSkipped: 'NONE',
  'verify-test-amount-alltests': 1,
}
