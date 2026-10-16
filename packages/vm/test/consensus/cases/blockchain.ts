import assert from 'node:assert/strict'

import type { Block, HeaderData } from '@ethereumjs/block'
import { createBlock, createBlockFromRLP } from '@ethereumjs/block'
import type { Blockchain } from '@ethereumjs/blockchain'
import { createBlockchain } from '@ethereumjs/blockchain'
import type { Common } from '@ethereumjs/common'
import type { BALJSONBlockAccessList, BlockLevelAccessList } from '@ethereumjs/util'
import {
  bytesToHex,
  createAddressFromString,
  createBlockLevelAccessListFromJSON,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import type { AfterTxEvent, VM } from '../../../src/index.ts'
import { createVM, runBlock } from '../../../src/index.ts'
import { compareBAL } from '../../tester/util/balComparatorAI.ts'
import {
  attachHeaderDiagnosis,
  getHeaderDiagnosis,
} from '../../tester/util/headerMismatchDiagnosis.ts'
import { setupPreConditions } from '../../util.ts'
import { createCommonForFork } from '../forkCommon.ts'
import type { BlockchainTestFixtureData } from '../types.ts'
import { EXCEPTION_MESSAGES, thrownMessage } from './exceptionMatch.ts'

type AssertLike = typeof assert

export async function runBlockchainTestCase(
  fork: string,
  testData: BlockchainTestFixtureData,
  kzg: microEthKZG,
  fixtureFilePath = '',
) {
  return runBlockchainTestCaseWithAssert(fork, testData, assert, kzg, fixtureFilePath)
}

export async function runBlockchainTestCaseWithAssert(
  fork: string,
  testData: BlockchainTestFixtureData,
  t: AssertLike,
  kzg: microEthKZG,
  fixtureFilePath = '',
) {
  const common = createCommonForFork(fork, testData, kzg)
  const isEip7928BalFixture = common.isActivatedEIP(7928)

  const genesisBlock = createBlock(
    { header: testData.genesisBlockHeader as HeaderData },
    { common, setHardfork: true },
  )
  const blockchain = await createBlockchain({ common, genesisBlock })
  const vm = await createVM({ common, blockchain })
  await setupPreConditions(vm.stateManager, testData)

  t.deepEqual(
    await vm.stateManager.getStateRoot(),
    genesisBlock.header.stateRoot,
    'correct pre stateRoot',
  )
  t.equal(
    bytesToHex(genesisBlock.hash()),
    testData.genesisBlockHeader.hash,
    'correct genesis block hash',
  )

  const runError = await runBlocks(vm, common, genesisBlock, testData, isEip7928BalFixture, t)
  const postFailures = await collectPostStateFailures(vm, blockchain, testData, t)

  if (runError === undefined && postFailures.length === 0) return

  throwCombinedFailure(runError, postFailures)
}

async function runBlocks(
  vm: VM,
  common: Common,
  genesisBlock: Block,
  testData: BlockchainTestFixtureData,
  isEip7928BalFixture: boolean,
  t: AssertLike,
): Promise<Error | undefined> {
  let parentBlock = genesisBlock
  const txBuffer: AfterTxEvent[] = []
  const onAfterTx = (event: AfterTxEvent) => {
    txBuffer.push(event)
  }
  vm.events.on('afterTx', onAfterTx)

  try {
    for (const { rlp, expectException, blockAccessList, rlp_decoded } of testData.blocks) {
      txBuffer.length = 0
      const providedBalJson = blockAccessList ?? rlp_decoded?.blockAccessList
      let block: Block | undefined
      try {
        block = createBlockFromRLP(hexToBytes(rlp), { common: vm.common, setHardfork: true })

        const enforceProvidedBal =
          common.isActivatedEIP(7928) &&
          providedBalJson !== undefined &&
          expectException !== undefined
        const result = await runBlock(vm, {
          block,
          root: parentBlock.header.stateRoot,
          setHardfork: true,
          ...(enforceProvidedBal ? { blockAccessList: providedBalJson } : {}),
        })
        await vm.blockchain.putBlock(block)
        parentBlock = block

        if (expectException !== undefined) {
          assert.fail(`Should have thrown with: ${expectException}`)
        }

        if (common.isActivatedEIP(7928) && isEip7928BalFixture) {
          assertBlockAccessList(block, result.blockLevelAccessList!, providedBalJson, t)
        }
      } catch (e: unknown) {
        if (expectException === undefined) {
          if (block !== undefined) {
            await attachHeaderDiagnosis(e as Error, block, txBuffer, vm.common)
          }
          throw e
        }
        assertExpectedException(expectException, e, t)
      }
    }
  } catch (e: unknown) {
    return e as Error
  } finally {
    vm.events.removeListener('afterTx', onAfterTx)
  }
  return undefined
}

function assertBlockAccessList(
  block: Block,
  generatedBAL: BlockLevelAccessList,
  providedBalJson: BALJSONBlockAccessList | undefined,
  t: AssertLike,
) {
  let balDiffMessage = ''
  if (providedBalJson !== undefined) {
    const expectedBAL = createBlockLevelAccessListFromJSON(providedBalJson)
    balDiffMessage = compareBAL(expectedBAL.raw(), generatedBAL.raw(), false).diffString
    t.deepEqual(
      bytesToHex(expectedBAL.hash()),
      bytesToHex(block.header.blockAccessListHash!),
      `expected block level access list correct${balDiffMessage}`,
    )
  }
  t.deepEqual(
    bytesToHex(generatedBAL.hash()),
    bytesToHex(block.header.blockAccessListHash!),
    `generated block level access list correct${balDiffMessage}`,
  )
}

function assertExpectedException(expectException: string, error: unknown, t: AssertLike) {
  const err = error as Error
  const message = thrownMessage(error)
  const context = `Error: ${message}\n${err.stack ?? ''}`
  const assertMatches = (candidate: string) => {
    t.ok(
      candidate in EXCEPTION_MESSAGES,
      `expectException: (${candidate}) should be in exceptionMessages. ${context}`,
    )
    t.match(message, EXCEPTION_MESSAGES[candidate], `Should have correct error for ${candidate}`)
  }

  if (!expectException.includes('|')) {
    assertMatches(expectException)
    return
  }

  const candidates = expectException.split('|')
  for (let i = 0; i < candidates.length; i++) {
    try {
      assertMatches(candidates[i])
      return
    } catch {
      if (i === candidates.length - 1) {
        t.fail(
          `Should have thrown one of the following exceptions: ${expectException}. Threw: ${err.message}`,
        )
      }
    }
  }
}

async function collectPostStateFailures(
  vm: VM,
  blockchain: Blockchain,
  testData: BlockchainTestFixtureData,
  t: AssertLike,
): Promise<string[]> {
  const failures: string[] = []

  try {
    const head = await blockchain.getCanonicalHeadBlock()
    t.equal(
      bytesToHex(head.hash()),
      testData.lastblockhash,
      'head block hash matches lastblockhash',
    )
  } catch (e: unknown) {
    failures.push(`head block hash: ${(e as Error)?.message ?? String(e)}`)
  }

  const postState = testData.postState ?? {}
  for (const address of Object.keys(postState)) {
    try {
      const account = await vm.stateManager.getAccount(createAddressFromString(address))
      t.ok(account, `account should be defined. Got: ${address}`)
      const expected = postState[address]
      t.equal(account!.balance, hexToBigInt(expected.balance), `correct balance (${address})`)
      t.equal(account!.nonce, hexToBigInt(expected.nonce), `correct nonce (${address})`)
      t.deepEqual(
        account!.codeHash,
        keccak_256(hexToBytes(expected.code)),
        `correct code (${address})`,
      )

      for (const [key, value] of Object.entries(expected.storage)) {
        const keyBytes = setLengthLeft(hexToBytes(key as `0x${string}`), 32)
        const storage = await vm.stateManager.getStorage(createAddressFromString(address), keyBytes)
        t.equal(bytesToHex(storage), value, `correct storage[${key}] (${address})`)
      }
    } catch (e: unknown) {
      failures.push((e as Error)?.message ?? String(e))
    }
  }

  return failures
}

function throwCombinedFailure(runError: Error | undefined, postFailures: string[]): never {
  const sections: string[] = []
  if (runError !== undefined) {
    sections.push(runError.message)
    const diagnosis = getHeaderDiagnosis(runError)
    if (diagnosis !== undefined) {
      sections.push(diagnosis)
    }
  }
  if (postFailures.length > 0) {
    const header =
      postFailures.length === 1
        ? `Post-run state issue:`
        : `Post-run state issues (${postFailures.length}):`
    sections.push([header, ...postFailures.map((m) => `  - ${m}`)].join('\n'))
  }

  const combined = new Error(sections.join('\n\n'))
  if (runError?.stack !== undefined) combined.stack = runError.stack
  throw combined
}

export { microEthKZG, trustedSetup }
