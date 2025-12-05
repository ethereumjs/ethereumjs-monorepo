import { assert, describe, it } from 'vitest'

import fs from 'fs'
import path from 'path'

import type { Block } from '@ethereumjs/block'
import { createBlock, createBlockFromRLP } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import {
  bytesToHex,
  createAddressFromString,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { createVM, runBlock } from '../../src/index.ts'
import { setupPreConditions } from '../util.ts'
import { createCommonForFork, loadExecutionSpecFixtures } from './executionSpecTestLoader.ts'

const customFixturesPath = process.env.TEST_PATH ?? '../execution-spec-tests'
const fixturesPath = path.resolve(customFixturesPath)

console.log(`Using execution-spec blockchain tests from: ${fixturesPath}`)

if (fs.existsSync(fixturesPath) === false) {
  describe('Execution-spec blockchain tests', () => {
    it.skip(`fixtures not found at ${fixturesPath}`, () => {})
  })
} else {
  const fixtures = loadExecutionSpecFixtures(fixturesPath, 'blockchain_tests')

  describe('Execution-spec blockchain tests', () => {
    if (fixtures.length === 0) {
      it.skip(`no execution-spec blockchain fixtures found under ${fixturesPath}`, () => {})
      return
    }

    for (const { id, fork, data } of fixtures) {
      it(`${fork}: ${id}`, async () => {
        await runBlockchainTestCase(fork, data, assert)
      }, 120000)
    }
  })
}

export async function runBlockchainTestCase(fork: string, testData: any, t: typeof assert) {
  const { from: common, to, timestamp } = createCommonForFork(fork, testData)
  const blockData = { header: testData.genesisBlockHeader }
  const genesisBlock = createBlock(blockData, { common })
  const blockchain = await createBlockchain({
    common,
    genesisBlock,
  })
  const vm = await createVM({
    common,
    blockchain,
  })
  await setupPreConditions(vm.stateManager, testData)

  const rlp = hexToBytes(testData.genesisRLP)
  t.deepEqual(genesisBlock.serialize(), rlp, 'correct genesis RLP')

  t.deepEqual(
    await vm.stateManager.getStateRoot(),
    genesisBlock.header.stateRoot,
    'correct pre stateRoot',
  )

  let parentBlock = genesisBlock
  for (const { blockHeader, rlp, expectException, rlp_decoded } of testData.blocks) {
    let block: Block | undefined
    const blockTimestamp =
      blockHeader !== undefined ? blockHeader.timestamp : rlp_decoded.blockHeader.timestamp
    const currentHF = vm.common.hardfork()
    try {
      if (to !== undefined) {
        if (hexToBigInt(blockTimestamp) >= timestamp) {
          vm.common.setHardfork(to)
        }
      }
      block = createBlockFromRLP(hexToBytes(rlp), { common: vm.common })
      t.equal(bytesToHex(block.serialize()), rlp, 'correct block RLP')

      await runBlock(vm, {
        block,
        root: parentBlock.header.stateRoot,
        generate: true,
      })
      await vm.blockchain.putBlock(block)
      parentBlock = block
    } catch (e: any) {
      // Reset hardfork to the current hardfork if block fails
      vm.common.setHardfork(currentHF)
      // Check if the block failed due to an expected exception
      t.exists(expectException, `expectException should be defined.  Error: ${e.message}`)
      // Check if the error message matches the expected exception
      t.match(
        e.message,
        exceptionMessages[expectException],
        `Should have correct error for ${expectException}`,
      )
    }
  }

  // Check final state after all blocks are processed
  const head = await blockchain.getCanonicalHeadBlock()
  t.equal(bytesToHex(head.hash()), testData.lastblockhash, `head block hash matches lastblockhash`)

  // Set state root to the head block's state root before checking accounts
  await vm.stateManager.setStateRoot(head.header.stateRoot)

  // Check post state
  for (const address of Object.keys(testData.postState)) {
    const account = await vm.stateManager.getAccount(createAddressFromString(address))
    t.exists(account, `account should be defined.  Got: ${address}`)
    const accountInfo = testData.postState[address]
    t.equal(account.balance, hexToBigInt(accountInfo.balance), 'correct balance')
    t.equal(account.nonce, hexToBigInt(accountInfo.nonce), 'correct nonce')
    t.deepEqual(account.codeHash, keccak_256(hexToBytes(accountInfo.code)), 'correct code')

    for (const [key, value] of Object.entries(accountInfo.storage)) {
      const keyBytes = setLengthLeft(hexToBytes(key as `0x${string}`), 32)
      const storage = await vm.stateManager.getStorage(createAddressFromString(address), keyBytes)
      t.equal(bytesToHex(storage), value, 'correct storage')
    }
  }
}

// EthJS error messages mapped to expected exception types
const exceptionMessages: Record<string, RegExp> = {
  'TransactionException.GAS_LIMIT_EXCEEDS_MAXIMUM':
    /^Transaction gas limit \d+ exceeds the maximum allowed by EIP-7825 \(\d+\)$/,
  'TransactionException.GAS_ALLOWANCE_EXCEEDED': /Invalid block: too much gas used./,
  'TransactionException.INTRINSIC_GAS_TOO_LOW':
    /^invalid transactions: errors at tx \d+: gasLimit is too low\. The gasLimit is lower than the minimum gas limit of \d+, the gas limit is: \d+ \(block number=\d+ hash=0x[a-f0-9]+ hf=\w+ baseFeePerGas=\d+ txs=\d+ uncles=\d+\)$/,
  'TransactionException.INTRINSIC_GAS_BELOW_FLOOR_GAS_COST':
    /^invalid transactions: errors at tx \d+: gasLimit is too low\. The gasLimit is lower than the minimum gas limit of \d+, the gas limit is: \d+ \(block number=\d+ hash=0x[a-f0-9]+ hf=\w+ baseFeePerGas=\d+ txs=\d+ uncles=\d+\)$/,
  'TransactionException.TYPE_3_TX_MAX_BLOB_GAS_ALLOWANCE_EXCEEDED':
    /^(?:invalid transactions: errors at tx \d+: )?tx causes total blob gas of \d+ to exceed maximum blob gas per block of \d+/,
  'TransactionException.TYPE_3_TX_BLOB_COUNT_EXCEEDED':
    /^\d+ blobs exceeds max \d+ blobs per tx \(EIP-7594\)/,
}
