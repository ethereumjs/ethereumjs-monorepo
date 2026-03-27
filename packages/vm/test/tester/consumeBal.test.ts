import { assert, describe, it } from 'vitest'

import path from 'path'

import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import {
  bytesToHex,
  createAddressFromString,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { consumeBal } from '../../src/consumeBal.ts'
import { createVM } from '../../src/index.ts'
import { setupPreConditions } from '../util.ts'
import { createCommonForFork, loadExecutionSpecFixtures } from './executionSpecTestLoader.ts'

const fixturesPath = path.resolve(
  '../execution-spec-tests/dev/blockchain_tests/amsterdam/v510_mixed_with_other_eips/blockchain_tests/eip7928_block_level_access_lists',
)
// Create KZG instance once at the top level (expensive operation)
const kzg = new microEthKZG(trustedSetup)

const fixtures = loadExecutionSpecFixtures(fixturesPath, 'blockchain_tests')

describe('consumeBal', () => {
  for (const { id, fork, data } of fixtures) {
    it(`${fork}: ${id}`, async () => {
      await consumeBalTestCase(fork, data, assert, kzg)
    })
  }
})

export async function consumeBalTestCase(
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

  for (const { blockAccessList, blockHeader } of testData.blocks) {
    if (blockAccessList !== undefined) {
      await consumeBal(vm, blockAccessList, hexToBytes(blockHeader.stateRoot))
    }
  }

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
