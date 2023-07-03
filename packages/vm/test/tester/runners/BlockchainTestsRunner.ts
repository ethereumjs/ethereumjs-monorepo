import { Block } from '@ethereumjs/block'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'
import { bytesToBigInt, initKZG } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { assert, expect, it, suite, test } from 'vitest'

import { verifyPostConditions } from '../../util'
import { DEFAULT_FORK_CONFIG, getRequiredForkConfigAlias, getTestDirs } from '../config'
import { getTestsFromArgs } from '../testLoader'

import {
  getBlockchainTests,
  getGetterArgs,
  getRunnerArgs,
  getTestPath,
  setupBlockchainTestVM,
  shouldSkip,
} from './runnerUtils'

import type { VM } from '../../../src'
import type { FileData } from '../testLoader'
import type { RunnerArgs, TestArgs, TestGetterArgs } from './runnerUtils'
import type { Blockchain } from '@ethereumjs/blockchain'
import type { Common } from '@ethereumjs/common'
import type { Trie } from '@ethereumjs/trie'
import type { TaskResult, Test } from 'vitest'

initKZG(kzg, __dirname + '/../../../../client/src/trustedSetups/devnet6.txt')

const name = 'BlockchainTests'
export class BlockchainTests {
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
    this.expectedTests = getBlockchainTests(argv, this.FORK_CONFIG_VM) ?? 0
  }
  recordFailing(task: Test<{}>) {
    if (this.failingTests[task.name] !== undefined) {
      this.failingTests[task.name].push(task.result)
    } else {
      this.failingTests[task.name] = [task.result]
    }
  }
  async handleError(error: string | undefined, expectException: string | boolean) {
    expect(expectException, `${expectException}`).toBeDefined()
    expect(error, `${error}`).toEqual(expectException)
  }
  async onFile(fileName: string, subDir: string, testName: string, test: any): Promise<void> {
    if (!shouldSkip(this.runSkipped, fileName)) {
      const testIdentifier = `${fileName}: ${testName}`
      this.testCount++
      assert.ok(testIdentifier)

      await this.runBlockchainTest(this.runnerArgs, test, testIdentifier)
    }
  }
  async runTestCase(
    raw: any,
    options: any,
    testData: any,
    currentBlock: bigint,
    blockchain: Blockchain,
    vm: VM,
    common: Common,
    state: Trie
  ) {
    const paramFork = `expectException${options.forkConfigTestSuite}`
    // Two naming conventions in ethereum/tests to indicate "exception occurs on all HFs" semantics
    // Last checked: ethereumjs-testing v1.3.1 (2020-05-11)
    const paramAll1 = 'expectExceptionALL'
    const paramAll2 = 'expectException'
    const expectException = (raw[paramFork] ??
      raw[paramAll1] ??
      raw[paramAll2] ??
      raw.blockHeader === undefined) as string | boolean

    // Here we decode the rlp to extract the block number
    // The block library cannot be used, as this throws on certain EIP1559 blocks when trying to convert
    try {
      const blockRlp = hexToBytes(raw.rlp as string)
      const decodedRLP: any = RLP.decode(Uint8Array.from(blockRlp))
      currentBlock = bytesToBigInt(decodedRLP[0][8])
    } catch (e: any) {
      await this.handleError(e, expectException)
      return
    }

    try {
      const blockRlp = hexToBytes(raw.rlp as string)
      // Update common HF
      let TD: bigint | undefined = undefined
      let timestamp: bigint | undefined = undefined
      try {
        const decoded: any = RLP.decode(blockRlp)
        const parentHash = decoded[0][0]
        TD = await blockchain.getTotalDifficulty(parentHash)
        timestamp = bytesToBigInt(decoded[0][11])
        // eslint-disable-next-line no-empty
      } catch (e) {}

      common.setHardforkBy({ blockNumber: currentBlock, td: TD, timestamp })

      // transactionSequence is provided when txs are expected to be rejected.>
      // To run this field we try to import them on the current state.
      if (raw.transactionSequence !== undefined) {
        const parentBlock = await vm.blockchain.getIteratorHead()
        const blockBuilder = await vm.buildBlock({
          parentBlock,
          blockOpts: { calcDifficultyFromHeader: parentBlock.header },
        })

        for (const txData of raw.transactionSequence as Record<
          'exception' | 'rawBytes' | 'valid',
          string
        >[]) {
          const shouldFail = txData.valid === 'false'
          it(`tx should ${shouldFail ? 'fail' : 'succeed'}`, async () => {
            try {
              const txRLP = hexToBytes(txData.rawBytes)
              const tx = TransactionFactory.fromSerializedData(txRLP, { common })
              await blockBuilder.addTransaction(tx)
              if (shouldFail) {
                assert.fail('tx should fail, but did not fail')
              }
            } catch (e: any) {
              if (!shouldFail) {
                assert.fail(`tx should not fail, but failed: ${e.message}`)
              } else {
                assert.ok('tx successfully failed')
              }
            }
          })
        }
        await blockBuilder.revert() // will only revert if checkpointed
      }

      const block = Block.fromRLPSerializedBlock(blockRlp, { common })
      await blockchain.putBlock(block)

      // This is a trick to avoid generating the canonical genesis
      // state. Generating the genesis state is not needed because
      // blockchain tests come with their own `pre` world state.
      // TODO: Add option to `runBlockchain` not to generate genesis state.
      //
      //vm._common.genesis().stateRoot = vm.stateManager._trie.root()
      try {
        await blockchain.iterator('vm', async (block: Block) => {
          const parentBlock = await blockchain!.getBlock(block.header.parentHash)
          const parentState = parentBlock.header.stateRoot
          // run block, update head if valid
          try {
            await vm.runBlock({ block, root: parentState, setHardfork: TD })
            // set as new head block
          } catch (error: any) {
            // remove invalid block
            await blockchain!.delBlock(block.header.hash())
            throw error
          }
        })
      } catch (e: any) {
        // if the test fails, then block.header is the prev because
        // vm.runBlock has a check that prevents the actual postState from being
        // imported if it is not equal to the expected postState. it is useful
        // for debugging to skip this, so that verifyPostConditions will compare
        // testData.postState to the actual postState, rather than to the preState.
        if (options.debug !== true) {
          // make sure the state is set before checking post conditions
          const headBlock = await vm.blockchain.getIteratorHead()
          ;(vm.stateManager as any)._trie.root(headBlock.header.stateRoot)
        } else {
          await verifyPostConditions(state, testData.postState)
        }

        throw e
      }

      //  await cacheDB._leveldb.close()

      if (expectException !== false) {
        assert.fail(`expected exception but test did not throw an exception: ${expectException}`)
      }
    } catch (error: any) {
      // caught an error, reduce block number
      currentBlock--
      await this.handleError(error, expectException)
    }
  }
  async runBlockchainTest(options: any, testData: any, id: string) {
    // ensure that the test data is the right fork data
    if (testData.network !== options.forkConfigTestSuite) {
      this.testCount++
      console.log(`skipping test: no data available for ${options.forkConfigTestSuite}`)
      return
    }

    test(`${id}`, async (name) => {
      console.log('name: ', name)
      try {
        const common = options.common.copy()
        const begin = Date.now()
        const { vm, blockchain, state } = await setupBlockchainTestVM(common, testData)
        const currentBlock = BigInt(0)
        suite('testData', async () => {
          for await (const [idx, raw] of testData.blocks.entries()) {
            this.testCount++
            test(`test: ${idx + 1}/${
              testData.blocks.length
            } -- CurrentBlock: ${currentBlock}`, async () => {
              await this.runTestCase(
                raw,
                options,
                testData,
                currentBlock,
                blockchain,
                vm,
                common,
                state
              )
            })
          }
        })
        this.testCount++
        it(`should have the correct _headHeaderHash`, async () => {
          assert.equal(
            bytesToHex((blockchain as any)._headHeaderHash),
            '0x' + testData.lastblockhash,
            `_headHeaderHash: ${bytesToHex(
              (blockchain as any)._headHeaderHash
            )} !== testData.lastblockhash ${testData.lastblockhash}`
          )
          const end = Date.now()
          const timeSpent = (end - begin) / 1000
          expect(timeSpent, `time spent: ${timeSpent}`).toBeGreaterThan(0)
        })
      } catch (e: any) {
        await this.handleError(e, false)
      }
    })
  }
  async runTests(): Promise<void> {
    if (this.customStateTest !== undefined) {
      return
    } else {
      const dirs = getTestDirs(this.FORK_CONFIG_VM, name)
      for (const dir of dirs) {
        suite(dir, async () => {
          const directory = getTestPath(dir, this.testGetterArgs, this.customTestsPath)
          const tests = await getTestsFromArgs(
            dir,
            this.onFile.bind(this),
            this.testGetterArgs,
            directory
          )
          for await (const [testDir, subDir] of Object.entries(tests as FileData)) {
            suite(testDir, async () => {
              if (Array.isArray(Object.values(subDir)[0])) {
                for await (const [fileName, testData] of Object.entries(subDir)) {
                  suite(fileName, async () => {
                    for await (const [testName, t] of Object.values(testData)) {
                      it(testName, async () => {
                        await this.onFile(fileName, testDir, testName, t)
                      })
                    }
                  })
                }
              } else {
                for await (const [subDirName, subSubDir] of Object.entries(subDir)) {
                  suite(subDirName, async () => {
                    for await (const [fileName, testData] of Object.entries(subSubDir)) {
                      suite(fileName, async () => {
                        for await (const tst of Object.values(testData)) {
                          const [testName, t] = tst as [string, any]
                          it(testName, async () => {
                            await this.onFile(fileName, testDir, testName, t)
                          })
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }

      if (this.expectedTests > 0) {
        it('checks test count', async () => {
          expect(this.testCount).toBeGreaterThan(this.expectedTests)
        })
      }
    }
  }
}
