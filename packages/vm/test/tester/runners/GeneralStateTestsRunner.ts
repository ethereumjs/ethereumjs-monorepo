import { toBytes } from '@ethereumjs/util'
import { bytesToHex, equalsBytes } from 'ethereum-cryptography/utils'
import { assert, expect, it } from 'vitest'

import { makeBlockFromEnv } from '../../util'
import { DEFAULT_FORK_CONFIG, getRequiredForkConfigAlias, getTestDirs } from '../config'
import { getTestFromSource, getTestsFromArgs } from '../testLoader'

import {
  getGetterArgs,
  getRunnerArgs,
  getStateTests,
  getTestPath,
  parseTestCases,
  setupStateTestVM,
  shouldSkip,
} from './runnerUtils'

import type { VM } from '../../../src'
import type { RunnerArgs, TestArgs, TestGetterArgs } from './runnerUtils'
import type { InterpreterStep } from '@ethereumjs/evm'
import type { DefaultStateManager } from '@ethereumjs/statemanager'
import type { TaskResult, Test } from 'vitest'

const name = 'GeneralStateTests'
export class GeneralStateTests {
  testCount: number
  FORK_CONFIG: string
  FORK_CONFIG_TEST_SUITE: string
  FORK_CONFIG_VM: string
  /**
   * Configuration for getting the tests from the ethereum/tests repository
   */
  testGetterArgs: TestGetterArgs
  /**
   * Run-time configuration
   */
  runnerArgs: RunnerArgs
  runSkipped: string[]
  expectedTests: number
  failingTests: Record<string, (TaskResult | undefined)[]>
  customStateTest: string | undefined
  customTestsPath: string | undefined
  constructor(argv: TestArgs) {
    this.expectedTests = 0
    this.failingTests = {}
    this.testCount = 0
    this.FORK_CONFIG = argv.fork !== undefined ? argv.fork : DEFAULT_FORK_CONFIG
    this.FORK_CONFIG_TEST_SUITE = getRequiredForkConfigAlias(this.FORK_CONFIG)
    this.FORK_CONFIG_VM = this.FORK_CONFIG.charAt(0).toLowerCase() + this.FORK_CONFIG.substring(1)
    this.customStateTest = argv.customStateTest
    this.customTestsPath = argv.customTestsPath
    this.testGetterArgs = getGetterArgs(argv, this.FORK_CONFIG_TEST_SUITE)
    this.runSkipped = this.testGetterArgs.runSkipped ?? []
    this.runnerArgs = getRunnerArgs(argv, this.FORK_CONFIG_VM, this.FORK_CONFIG_TEST_SUITE)
    /**
     * Modify the forkConfig string to ensure it works with RegEx (escape `+` characters)
     */
    if (this.testGetterArgs.forkConfig.includes('+')) {
      let str = this.testGetterArgs.forkConfig
      const indices = []
      for (let i = 0; i < str.length; i++) {
        if (str[i] === '+') {
          indices.push(i)
        }
      }
      // traverse array in reverse order to ensure indices match when we replace the '+' with '/+'
      for (let i = indices.length - 1; i >= 0; i--) {
        str = `${str.slice(0, indices[i])}\\${str.slice(indices[i])}`
      }
      this.testGetterArgs.forkConfig = str
    }
    this.expectedTests =
      getStateTests(
        this.FORK_CONFIG_VM,
        argv['verify-test-amount-alltests'],
        argv['expected-test-amount']
      ) ?? 0
  }
  recordFailing(task: Test<{}>) {
    if (this.failingTests[task.name] !== undefined) {
      this.failingTests[task.name].push(task.result)
    } else {
      this.failingTests[task.name] = [task.result]
    }
  }
  async onFile(
    this: GeneralStateTests,
    fileName: string,
    subDir: string,
    testName: string,
    test: any
  ): Promise<void> {
    if (!shouldSkip(this.runSkipped, fileName)) {
      const testIdentifier = `${subDir}/${fileName}: ${testName}`
      assert.ok(testIdentifier)
      await this.runStateTest(this.runnerArgs, test, testIdentifier)
    }
  }
  async runTestCase(options: any, testData: any) {
    const begin = Date.now()
    // Copy the common object to not create long-lasting
    // references in memory which might prevent GC
    const common = options.common.copy()
    let execInfo: string
    const testCaseSetup = await setupStateTestVM(common, testData)
    const vm = testCaseSetup.vm
    const tx = testCaseSetup.tx
    execInfo = testCaseSetup.execInfo
    const afterTxHandler = async () => {
      const stateRoot = {
        stateRoot: bytesToHex((vm.stateManager as any)._trie.root),
      }
      assert.ok(JSON.stringify(stateRoot), `stateRoot: ${stateRoot}`)
    }

    if (tx !== undefined) {
      if (tx.isValid() === true) {
        const block = makeBlockFromEnv(testData.env, { common })
        if (options.jsontrace === true) {
          vm.evm.events!.on('step', this.stepHandler)
          vm.events.on('afterTx', afterTxHandler)
        }
        try {
          await vm.runTx({ tx, block })
          execInfo = 'successful tx run'
        } catch (e: any) {
          execInfo = `tx runtime error :${e.message}`
        }
      } else {
        execInfo = 'tx validation failed'
      }
    }

    // Cleanup touched accounts (this wipes coinbase if it is empty on HFs >= TangerineWhistle)
    await (<VM>vm).evm.journal.cleanup()
    await (<VM>vm).stateManager.getStateRoot() // Ensure state root is updated (flush all changes to trie)

    const stateManagerStateRoot = (<DefaultStateManager>vm.stateManager)._trie.root()
    const testDataPostStateRoot = toBytes(testData.postStateRoot)
    const stateRootsAreEqual = equalsBytes(stateManagerStateRoot, testDataPostStateRoot)

    vm.evm.events!.removeListener('step', this.stepHandler)
    vm.events.removeListener('afterTx', afterTxHandler)

    // @ts-ignore Explicitly delete objects for memory optimization (early GC)
    // TODO FIXME
    //common = blockchain = state = stateManager = evm = vm = null // eslint-disable-line
    const end = Date.now()
    const timeSpent = `${(end - begin) / 1000} secs`
    assert.isTrue((end - begin) / 1000 > 0)
    assert.ok(stateRootsAreEqual, `the state roots should match (${execInfo})`)
    return parseFloat(timeSpent)
  }
  async runStateTest(options: any, testData: any, id: string) {
    try {
      const testCases = parseTestCases(
        options.forkConfigTestSuite,
        testData,
        options.data,
        options.gasLimit,
        options.value
      )
      if (testCases.length === 0) {
        it.skip(`No ${options.forkConfigTestSuite} post state defined, skip test`)
        return
      }
      for await (const [idx, testCase] of testCases.entries()) {
        const testRun = `${id} ${idx + 1}/${testCases.length}`
        this.testCount++
        if (options.reps !== undefined && options.reps > 0) {
          let totalTimeSpent = 0
          for (let x = 0; x < options.reps; x++) {
            const rep = `${x + 1}/${options.reps}`
            it(`Rep [${rep}]`, async () => {
              totalTimeSpent += await this.runTestCase(options, testCase)
            })
          }
          assert.ok(`Average test run: ${(totalTimeSpent / options.reps).toLocaleString()}`)
        } else {
          it(`runs ${testRun}`, async () => {
            await this.runTestCase(options, testCase)
          })
        }
      }
    } catch (e: any) {
      console.log(e)
      assert.fail(`error running test case for fork: ${options.forkConfigTestSuite}`)
    }
  }
  async runTests(): Promise<void> {
    if (this.customStateTest !== undefined) {
      const fileName = this.customStateTest
      it(`customStateTest:${fileName}`, async () => {
        getTestFromSource(fileName, this.onCustomStateTest(fileName, this.runnerArgs))
      })
    } else {
      const dirs = getTestDirs(this.FORK_CONFIG_VM, name)
      for await (const dir of dirs) {
        const directory = getTestPath(dir, this.testGetterArgs, this.customTestsPath)
        await getTestsFromArgs(dir, this.onFile.bind(this), this.testGetterArgs, directory)
      }

      if (this.expectedTests > 0) {
        it('checks test count', async () => {
          expect(this.testCount).toBeGreaterThan(this.expectedTests)
        })
      }
    }
  }
  onCustomStateTest = (fileName: string, runnerArgs: RunnerArgs) => {
    return async (err: string | null, test: any) => {
      if (err !== null) {
        return assert.equal(err, 'err')
      } else {
        const id = `${fileName}: ${test.testName}`
        assert.ok(id)
        await this.runStateTest(runnerArgs, test, id)
      }
    }
  }
  stepHandler(e: InterpreterStep) {
    let hexStack = []
    hexStack = e.stack.map((item: bigint) => {
      return '0x' + item.toString(16)
    })
    const opTrace = {
      pc: e.pc,
      op: e.opcode.name,
      gas: '0x' + e.gasLeft.toString(16),
      gasCost: '0x' + e.opcode.fee.toString(16),
      stack: hexStack,
      depth: e.depth,
      opName: e.opcode.name,
    }
    assert.ok(JSON.stringify(opTrace))
  }
}
