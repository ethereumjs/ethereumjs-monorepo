import { assert, describe, it } from 'vitest'

import fs from 'fs'
import path from 'path'

import type { Block } from '@ethereumjs/block'
import { createBlock, createBlockFromRLP } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
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
import { createVM, runBlock } from '../../src/index.ts'
import { setupPreConditions } from '../util.ts'
import { createCommonForFork, loadExecutionSpecFixtures } from './executionSpecTestLoader.ts'
import { compareBAL } from './util/balComparatorAI.ts'
import { annotateFixture } from './util/perDirectoryReporter.ts'

const customFixturesPath = process.env.TEST_PATH ?? '../execution-spec-tests'
const fixturesPath = path.resolve(customFixturesPath)
const testFile = process.env.TEST_FILE
const testCase = process.env.TEST_CASE

// Networks to skip (BPO transition forks are not yet supported)
const SKIP_NETWORKS: string[] = [
  'BPO1ToBPO2AtTime15k',
  'BPO2ToBPO3AtTime15k',
  'BPO3ToBPO4AtTime15k',
]

console.log(`Using execution-spec blockchain tests from: ${fixturesPath}`)
if (SKIP_NETWORKS.length > 0) {
  console.log(`Networks skipped: ${SKIP_NETWORKS.join(', ')}`)
}
if (testFile !== undefined) {
  console.log(`Filtering tests to file: ${testFile}`)
}
if (testCase !== undefined) {
  console.log(`Filtering tests to case: ${testCase}`)
}

// Create KZG instance once at the top level (expensive operation)
const kzg = new microEthKZG(trustedSetup)

if (fs.existsSync(fixturesPath) === false) {
  describe('Execution-spec blockchain tests', () => {
    it.skip(`fixtures not found at ${fixturesPath}`, () => {})
  })
} else {
  let fixtures = loadExecutionSpecFixtures(fixturesPath, 'blockchain_tests')

  // Filter by TEST_FILE if provided (works with or without .json extension)
  if (testFile !== undefined) {
    const normalizedTestFile = testFile.endsWith('.json') ? testFile : `${testFile}.json`
    fixtures = fixtures.filter((f) => path.basename(f.filePath) === normalizedTestFile)
  }

  // Filter by TEST_CASE if provided (matches against the test case id/name)
  if (testCase !== undefined) {
    fixtures = fixtures.filter((f) => f.id.includes(testCase))
  }

  // Filter out skipped networks
  if (SKIP_NETWORKS.length > 0) {
    fixtures = fixtures.filter((f) => !SKIP_NETWORKS.includes(f.fork))
  }

  describe('Execution-spec blockchain tests', () => {
    if (fixtures.length === 0) {
      it.skip(`no execution-spec blockchain fixtures found under ${fixturesPath}`, () => {})
      return
    }

    for (const { id, fork, filePath, data } of fixtures) {
      it(`${fork}: ${id}`, async ({ task }) => {
        annotateFixture(task, filePath, fixturesPath, 'blockchain tests')
        await runBlockchainTestCase(fork, data, assert, kzg)
      }, 360000) // 6 minutes
    }
  })
}

export async function runBlockchainTestCase(
  fork: string,
  testData: any,
  t: typeof assert,
  kzg: microEthKZG,
) {
  const common = createCommonForFork(fork, testData, kzg)
  const genesisBlockData = { header: testData.genesisBlockHeader }
  const genesisBlock = createBlock(genesisBlockData, { common, setHardfork: true })
  const blockchain = await createBlockchain({
    common,
    genesisBlock,
  })
  const vm = await createVM({
    common,
    blockchain,
  })
  await setupPreConditions(vm.stateManager, testData)

  //const rlp = hexToBytes(testData.genesisRLP)
  //t.deepEqual(genesisBlock.serialize(), rlp, 'correct genesis RLP')

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

  let parentBlock = genesisBlock

  // Capture errors from block processing so post-state checks still run; this
  // surfaces state-divergence details even when a block throws unexpectedly.
  let runError: Error | undefined

  try {
    for (const {
      rlp,
      expectException,
      blockHeader,
      rlp_decoded,
      blockAccessList,
    } of testData.blocks) {
      const expectedHash = blockHeader?.hash ?? rlp_decoded?.blockHeader?.hash ?? undefined
      let block: Block | undefined
      try {
        block = createBlockFromRLP(hexToBytes(rlp), { common: vm.common, setHardfork: true })
        //t.equal(bytesToHex(block.serialize()), rlp, 'correct block RLP')
        if (expectedHash !== undefined) {
          //t.equal(bytesToHex(block.hash()), expectedHash, 'correct block hash')
        }
        const result = await runBlock(vm, {
          block,
          root: parentBlock.header.stateRoot,
          setHardfork: true,
        })
        await vm.blockchain.putBlock(block)
        parentBlock = block
        t.notExists(expectException, `Should have thrown with: ${expectException}`)

        // Check if the block level access list is correct
        if (common.isActivatedEIP(7928)) {
          let balDiffMessage = ''
          if (blockAccessList !== undefined) {
            const expectedBAL = createBlockLevelAccessListFromJSON(blockAccessList)
            // Use the BAL comparator to show a colored diff of any mismatches
            // Pass false to skip console output during test, we'll include it in the assertion
            const { diffString } = compareBAL(
              expectedBAL.raw(),
              result.blockLevelAccessList!.raw(),
              false,
            )
            balDiffMessage = diffString
            t.deepEqual(
              bytesToHex(expectedBAL.hash()),
              bytesToHex(block.header.blockAccessListHash!),
              `expected block level access list correct${balDiffMessage}`,
            )
          }
          t.deepEqual(
            bytesToHex(result.blockLevelAccessList!.hash()),
            bytesToHex(block.header.blockAccessListHash!),
            `generated block level access list correct${balDiffMessage}`,
          )
        }
      } catch (e: any) {
        if (expectException === undefined) {
          throw e
        }
        // Check if the block failed due to an expected exception
        t.exists(
          expectException,
          `expectException should be defined.  Error: ${e.message}\n${e.stack}`,
        )

        if (expectException.includes('|') === true) {
          const exceptions = expectException.split('|')
          let i = 0
          while (i < exceptions.length) {
            try {
              t.isTrue(
                exceptions[i] in exceptionMessages,
                `expectException: (${exceptions[i]}) should be in exceptionMessages.  Error: ${e.message}\n${e.stack}`,
              )
              t.match(
                e.message,
                exceptionMessages[exceptions[i]],
                `Should have correct error for ${exceptions[i]}`,
              )
              break
            } catch {
              if (i === exceptions.length - 1) {
                t.fail(
                  `Should have thrown one of the following exceptions: ${expectException}.  Threw: ${e.message}`,
                )
                break
              }
              i++
            }
          }
        } else {
          t.isTrue(
            expectException in exceptionMessages,
            `expectException: (${expectException}) should be in exceptionMessages.  Error: ${e.message}\n${e.stack}`,
          )
          // Check if the error message matches the expected exception
          t.match(
            e.message,
            exceptionMessages[expectException],
            `Should have correct error for ${expectException} -- got: ${e.message}`,
          )
        }
      }
    }
  } catch (e: any) {
    runError = e
  }

  // Always check final state and post state, even if block processing threw.
  // Individual diffs go into `postFailures` so we can show them alongside any
  // block-processing error rather than masking them with an early throw.
  const postFailures: string[] = []

  try {
    const head = await blockchain.getCanonicalHeadBlock()
    t.equal(
      bytesToHex(head.hash()),
      testData.lastblockhash,
      `head block hash matches lastblockhash`,
    )
  } catch (e: any) {
    postFailures.push(`head block hash: ${e?.message ?? String(e)}`)
  }

  const postState = testData.postState ?? {}
  for (const address of Object.keys(postState)) {
    try {
      const account = await vm.stateManager.getAccount(createAddressFromString(address))
      t.exists(account, `account should be defined.  Got: ${address}`)
      const accountInfo = postState[address]
      t.equal(account.balance, hexToBigInt(accountInfo.balance), `correct balance (${address})`)
      t.equal(account.nonce, hexToBigInt(accountInfo.nonce), `correct nonce (${address})`)
      t.deepEqual(
        account.codeHash,
        keccak_256(hexToBytes(accountInfo.code)),
        `correct code (${address})`,
      )

      for (const [key, value] of Object.entries(accountInfo.storage)) {
        const keyBytes = setLengthLeft(hexToBytes(key as `0x${string}`), 32)
        const storage = await vm.stateManager.getStorage(createAddressFromString(address), keyBytes)
        t.equal(bytesToHex(storage), value, `correct storage[${key}] (${address})`)
      }
    } catch (e: any) {
      postFailures.push(e?.message ?? String(e))
    }
  }

  if (runError === undefined && postFailures.length === 0) return

  // Build a combined failure. If a block-run error was the root cause, keep
  // its original stack so vitest's source-mapped frames still point there.
  const sections: string[] = []
  if (runError !== undefined) sections.push(runError.message)
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

// EthJS error messages mapped to expected exception types
const exceptionMessages: Record<string, RegExp> = {
  // TransactionException entries
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
  'TransactionException.INTRINSIC_GAS_BELOW_FLOOR_GAS_COST': /gasLimit is too low/,
  'TransactionException.INTRINSIC_GAS_TOO_LOW': /gasLimit is too low|INTRINSIC_GAS_TOO_LOW/,
  'TransactionException.NONCE_MISMATCH_TOO_LOW': /the tx doesn't have the correct nonce/,
  'TransactionException.PRIORITY_GREATER_THAN_MAX_FEE_PER_GAS':
    /maxFeePerGas cannot be less than maxPriorityFeePerGas/,
  'TransactionException.SENDER_NOT_EOA': /invalid sender address, address is not EOA/,
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

  // BlockException entries
  'BlockException.GAS_USED_OVERFLOW': /tx has a higher gas limit than the block/,
  'BlockException.INCORRECT_BLOB_GAS_USED': /invalid blobGasUsed/,
  'BlockException.INCORRECT_BLOCK_FORMAT':
    /(?:blob gas used can only be provided with EIP4844 activated|^invalid header.*)/,
  'BlockException.INCORRECT_EXCESS_BLOB_GAS': /expected blob gas: \d+, got: \d+/,
  'BlockException.INVALID_BASEFEE_PER_GAS': /^Invalid block: base fee not correct .*$/,
  'BlockException.INVALID_DEPOSIT_EVENT_LAYOUT': /invalid deposit log: unsupported data layout/,
  'BlockException.INVALID_REQUESTS': /invalid requestsHash/,
  'BlockException.INVALID_WITHDRAWALS_ROOT': /invalid withdrawals trie/,
  'BlockException.SYSTEM_CONTRACT_CALL_FAILED': /system contract call failed/,
  'BlockException.SYSTEM_CONTRACT_EMPTY': /system contract empty/,
  'BlockException.INVALID_GASLIMIT': /gas limit/,
}
