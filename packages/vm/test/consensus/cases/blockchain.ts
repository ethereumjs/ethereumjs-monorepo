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
  const isEip7928BalFixture = fixtureFilePath.includes('eip7928_block_level_access_lists')
  const common = createCommonForFork(fork, testData, kzg)

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
  const context = `Error: ${err.message}\n${err.stack}`
  const assertMatches = (candidate: string) => {
    t.ok(
      candidate in exceptionMessages,
      `expectException: (${candidate}) should be in exceptionMessages. ${context}`,
    )
    t.match(err.message, exceptionMessages[candidate], `Should have correct error for ${candidate}`)
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

const exceptionMessages: Record<string, RegExp> = {
  'TransactionException.GAS_ALLOWANCE_EXCEEDED':
    /(?:tx has a higher gas limit than the block|tx unable to pay base fee)/,
  'TransactionException.GAS_LIMIT_EXCEEDS_MAXIMUM':
    /^Transaction gas limit \d+ exceeds the maximum allowed by EIP-7825 \(\d+\)$/,
  'TransactionException.INITCODE_SIZE_EXCEEDED':
    /the initcode size of this transaction is too large/,
  'TransactionException.INSUFFICIENT_ACCOUNT_FUNDS': /sender doesn't have enough funds to send tx/,
  'TransactionException.INSUFFICIENT_MAX_FEE_PER_BLOB_GAS':
    /Transaction's maxFeePerBlobGas \d+\) is less than block blobGasPrice \(\d+\)/,
  'TransactionException.INSUFFICIENT_MAX_FEE_PER_GAS': /tx unable to pay base fee/,
  'TransactionException.INTRINSIC_GAS_BELOW_FLOOR_GAS_COST':
    /gasLimit is too low|INTRINSIC_GAS_TOO_LOW|exceeds the EIP-7825 cap/,
  'TransactionException.INTRINSIC_GAS_TOO_LOW':
    /gasLimit is too low|INTRINSIC_GAS_TOO_LOW|exceeds the EIP-7825 cap/,
  'TransactionException.NONCE_MISMATCH_TOO_LOW': /the tx doesn't have the correct nonce/,
  'TransactionException.PRIORITY_GREATER_THAN_MAX_FEE_PER_GAS':
    /maxFeePerGas cannot be less than maxPriorityFeePerGas/,
  'TransactionException.SENDER_NOT_EOA': /invalid sender address, address is not EOA/,
  'TransactionException.INVALID_SIGNATURE_VRS': /Invalid Signature/i,
  'TransactionException.INVALID_CHAINID':
    /Common chain ID|not matching the derived chain ID|Incompatible EIP155-based V/i,
  'TransactionException.NONCE_MISMATCH_TOO_HIGH': /the tx doesn't have the correct nonce/,
  'TransactionException.NONCE_IS_MAX': /nonce cannot equal or exceed MAX_UINT64/,
  'TransactionException.GASLIMIT_PRICE_PRODUCT_OVERFLOW':
    /gas limit \* gasPrice cannot exceed MAX_INTEGER/,
  'TransactionException.TYPE_1_TX_PRE_FORK': /^EIP-2930 not enabled on Common$/,
  'TransactionException.TYPE_2_TX_PRE_FORK': /^EIP-1559 not enabled on Common$/,
  'TransactionException.TYPE_3_TX_BLOB_COUNT_EXCEEDED':
    /^\d+ blobs exceeds max \d+ blobs per tx \(EIP-7594\)/,
  'TransactionException.TYPE_3_TX_CONTRACT_CREATION':
    /tx should have a "to" field and cannot be used to create contracts/,
  'TransactionException.TYPE_3_TX_INVALID_BLOB_VERSIONED_HASH':
    /versioned hash does not start with KZG commitment version/,
  'TransactionException.TYPE_3_TX_MAX_BLOB_GAS_ALLOWANCE_EXCEEDED':
    /^(?:invalid transactions: errors at tx \d+: )?tx causes total blob gas of \d+ to exceed maximum blob gas per block of \d+/,
  'TransactionException.TYPE_3_TX_PRE_FORK': /^EIP-4844 not enabled on Common$/,
  'TransactionException.TYPE_3_TX_WITH_FULL_BLOBS': /Invalid EIP-4844 transaction/,
  'TransactionException.TYPE_3_TX_ZERO_BLOBS': /tx should contain at least one blob/,
  'TransactionException.TYPE_4_EMPTY_AUTHORIZATION_LIST': /authorization list is empty/,
  'TransactionException.TYPE_4_TX_CONTRACT_CREATION':
    /tx should have a "to" field and cannot be used to create contracts/,
  'TransactionException.TYPE_4_TX_PRE_FORK': /^EIP-7702 not enabled on Common$/,
  'BlockException.GAS_USED_OVERFLOW': /tx has a higher gas limit than the block/,
  'BlockException.INCORRECT_BLOB_GAS_USED': /invalid blobGasUsed/,
  'BlockException.INCORRECT_BLOCK_FORMAT':
    /(?:blob gas used can only be provided with EIP4844 activated|^invalid header.*)/,
  'BlockException.INCORRECT_EXCESS_BLOB_GAS': /expected blob gas: \d+, got: \d+/,
  'BlockException.INVALID_BASEFEE_PER_GAS': /^Invalid block: base fee not correct .*$/,
  'BlockException.INVALID_DEPOSIT_EVENT_LAYOUT': /invalid deposit log: unsupported data layout/,
  'BlockException.INVALID_REQUESTS': /invalid requestsHash/,
  'BlockException.INVALID_BAL_HASH': /invalid block access list hash/,
  'BlockException.INVALID_BLOCK_HASH': /invalid block access list hash/,
  'BlockException.INVALID_BLOCK_ACCESS_LIST': /invalid block access list/,
  'BlockException.BLOCK_ACCESS_LIST_GAS_LIMIT_EXCEEDED': /block access list gas limit exceeded/,
  'BlockException.INVALID_WITHDRAWALS_ROOT': /invalid withdrawals trie/,
  'BlockException.SYSTEM_CONTRACT_CALL_FAILED': /system contract call failed/i,
  'BlockException.SYSTEM_CONTRACT_EMPTY': /system contract empty/i,
  'BlockException.INVALID_GASLIMIT': /gas limit/,
}

export { microEthKZG, trustedSetup }
