import * as path from 'path'
import { afterEach, assert, describe, it } from 'vitest'

import {
  DEFAULT_FORK_CONFIG,
  DEFAULT_TESTS_PATH,
  SKIP_SLOW,
  getCommon,
  getExpectedTests,
  getRequiredForkConfigAlias,
  getSkipTests,
  getTestDirs,
} from './config'
import { runBlockchainTest } from './runners/BlockchainTestsRunner'
import { getTestFromSource, getTestsFromArgs } from './testLoader'

import type { Common } from '@ethereumjs/common'

interface Args {
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

export const defaultArgs: Args = {
  blockchain: true,
  skip: 'ALL',
  runSkipped: 'NONE',
  'verify-test-amount-alltests': 1,
}

export async function runTests(argv: Args) {
  let assertCount = 0
  const name = 'BlockchainTests'
  const runner = runBlockchainTest

  const FORK_CONFIG: string = argv.fork !== undefined ? argv.fork : DEFAULT_FORK_CONFIG
  const FORK_CONFIG_TEST_SUITE = getRequiredForkConfigAlias(FORK_CONFIG)

  // Examples: Istanbul -> istanbul, MuirGlacier -> muirGlacier
  const FORK_CONFIG_VM = FORK_CONFIG.charAt(0).toLowerCase() + FORK_CONFIG.substring(1)
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
  /**
   * Run-time configuration
   */
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
  } = {
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

  /**
   * Modify the forkConfig string to ensure it works with RegEx (escape `+` characters)
   */
  if (testGetterArgs.forkConfig.includes('+')) {
    let str = testGetterArgs.forkConfig
    const indices = []
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '+') {
        indices.push(i)
      }
    }
    // traverse array in reverse order to ensure indices match when we replace the '+' with '/+'
    for (let i = indices.length - 1; i >= 0; i--) {
      str = `${str.substr(0, indices[i])}\\${str.substr(indices[i])}`
    }
    testGetterArgs.forkConfig = str
  }
  console.log({
    FORK_CONFIG,
    forkConfig: testGetterArgs.forkConfig,
    FORK_CONFIG_TEST_SUITE,
    FORK_CONFIG_VM,
    jsontrace: argv.jsontrace,
    dist: argv.dist,
    data: argv.data,
    gasLimit: argv.gas,
    value: argv.value,
    debug: argv.debug,
    reps: argv.reps,
  })

  const expectedTests: number | undefined =
    argv['verify-test-amount-alltests'] > 0
      ? getExpectedTests(FORK_CONFIG_VM, name)
      : argv['expected-test-amount'] !== undefined && argv['expected-test-amount'] > 0
      ? argv['expected-test-amount']
      : undefined
  let testIdentifier: string
  const failingTests: Record<string, string[] | undefined> = {}
  afterEach((context) => {
    context.onTestFailed(() => {
      if (failingTests[testIdentifier] !== undefined) {
        ;(failingTests[testIdentifier] as string[]).push(context.task.name)
      } else {
        failingTests[testIdentifier] = [context.task.name]
      }
    })
    assertCount++
  })
  // Tests for HFs before Istanbul have been moved under `LegacyTests/Constantinople`:
  // https://github.com/ethereum/tests/releases/tag/v7.0.0-beta.1

  const dirs = getTestDirs(FORK_CONFIG_VM, name)
  for await (const dir of dirs) {
    if (argv.customTestsPath !== undefined) {
      testGetterArgs.directory = argv.customTestsPath as string
    } else {
      const testDir = testGetterArgs.dir ?? ''
      const testsPath = testGetterArgs.testsPath ?? DEFAULT_TESTS_PATH
      testGetterArgs.directory = path.join(testsPath, dir, testDir)
    }
    const runT = async (fileName: string, subDir: string, testName: string, test: any) => {
      SKIP_SLOW.includes(fileName) && console.log(` slow test: ${fileName}`)
      const runSkipped = testGetterArgs.runSkipped
      const inRunSkipped = runSkipped.includes(fileName)
      if (runSkipped.length === 0 || inRunSkipped === true) {
        testIdentifier = `file: ${subDir} test: ${testName}`
        it(`should run blockchain test: ${testName}`, async () => {
          afterEach((context) => {
            context.onTestFailed(() => {
              if (failingTests[testIdentifier] !== undefined) {
                ;(failingTests[testIdentifier] as string[]).push(context.task.name)
              } else {
                failingTests[testIdentifier] = [context.task.name]
              }
            })
            assertCount++
          })
          assert.ok(testIdentifier)
          await runner(runnerArgs, test)
        })
      }
    }
    await getTestsFromArgs(dir, runT, testGetterArgs)
  }

  for (const failingTestIdentifier in failingTests) {
    console.log(`Errors thrown in ${failingTestIdentifier}:`)
    const errors = failingTests[failingTestIdentifier] as string[]
    for (let i = 0; i < errors.length; i++) {
      console.log('\t' + errors[i])
    }
  }

  if (expectedTests !== undefined) {
    it('checks assert count', async () => {
      assert.ok(
        assertCount >= expectedTests,
        `expected ${expectedTests} checks, got ${assertCount}`
      )
    })
  }
  for (const slow of SKIP_SLOW) {
    console.log({ slow })
  }
}
