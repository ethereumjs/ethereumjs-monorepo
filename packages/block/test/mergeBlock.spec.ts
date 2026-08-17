import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  KECCAK256_RLP,
  KECCAK256_RLP_ARRAY,
  createZeroAddress,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Block, createBlock, createBlockHeader } from '../src/index.ts'

import type { BlockHeader } from '../src/index.ts'

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Paris,
})

function validateMergeHeader(header: BlockHeader) {
  assert.isTrue(equalsBytes(header.parentHash, new Uint8Array(32)), 'parentHash')
  assert.isTrue(equalsBytes(header.uncleHash, KECCAK256_RLP_ARRAY), 'uncleHash')
  assert.isTrue(header.coinbase.equals(createZeroAddress()), 'coinbase')
  assert.isTrue(equalsBytes(header.stateRoot, new Uint8Array(32)), 'stateRoot')
  assert.isTrue(equalsBytes(header.transactionsTrie, KECCAK256_RLP), 'transactionsTrie')
  assert.isTrue(equalsBytes(header.receiptTrie, KECCAK256_RLP), 'receiptTrie')
  assert.isTrue(equalsBytes(header.logsBloom, new Uint8Array(256)), 'logsBloom')
  assert.strictEqual(header.difficulty, BigInt(0), 'difficulty')
  assert.strictEqual(header.number, BigInt(0), 'number')
  assert.strictEqual(header.gasLimit, BigInt('0xffffffffffffff'), 'gasLimit')
  assert.strictEqual(header.gasUsed, BigInt(0), 'gasUsed')
  assert.strictEqual(header.timestamp, BigInt(0), 'timestamp')
  assert.isTrue(header.extraData.length <= 32, 'extraData')
  assert.strictEqual(header.mixHash.length, 32, 'mixHash')
  assert.isTrue(equalsBytes(header.nonce, new Uint8Array(8)), 'nonce')
}

describe('[Header]: Casper PoS / The Merge Functionality', () => {
  it('should construct default blocks with post-merge PoS constants fields', () => {
    const header = createBlockHeader({}, { common })
    validateMergeHeader(header)

    const block = new Block(undefined, undefined, undefined, undefined, { common })
    validateMergeHeader(block.header)
  })

  it('should throw if non merge-conforming PoS constants are provided', () => {
    assert.throws(() => {
      const headerData = { uncleHash: hexToBytes('0x123abc') }
      createBlockHeader(headerData, { common })
    }, 'Invalid PoS block: , uncleHash: 0x123abc')

    assert.throws(() => {
      const headerData = { difficulty: BigInt(123456), number: 1n }
      createBlockHeader(headerData, { common })
    }, 'Invalid PoS block: , difficulty: 123456')

    assert.throws(() => {
      const headerData = { extraData: new Uint8Array(33).fill(1), number: 1n }
      createBlockHeader(headerData, { common })
    }, 'cannot exceed 32 bytes length')

    assert.throws(() => {
      const headerData = { mixHash: new Uint8Array(30).fill(1) }
      createBlockHeader(headerData, { common })
    }, 'mixHash must be 32 bytes, received 30 bytes')

    assert.throws(() => {
      const headerData = { nonce: new Uint8Array(8).fill(1), number: 1n }
      createBlockHeader(headerData, { common })
    }, 'Invalid PoS block: , nonce: 0x0101010101010101')
  })

  it('test that a PoS block with uncles cannot be produced', () => {
    assert.throws(() => {
      new Block(undefined, undefined, [createBlockHeader(undefined, { common })], undefined, {
        common,
      })
    }, 'Block initialization with uncleHeaders on a PoS network is not allowed')
  })

  it('EIP-4399: prevRandao should return mixHash value', () => {
    const mixHash = new Uint8Array(32).fill(3)
    let block = createBlock({ header: { mixHash } }, { common })
    assert.isTrue(
      equalsBytes(block.header.prevRandao, mixHash),
      'prevRandao should return mixHash value',
    )

    const commonLondon = common.copy()
    commonLondon.setHardfork(Hardfork.London)
    block = createBlock({ header: { mixHash } }, { common: commonLondon })
    assert.throw(
      () => block.header.prevRandao,
      'The prevRandao parameter can only be accessed when EIP-4399 is activated',
      undefined,
      'prevRandao should throw if EIP-4399 is not activated',
    )
  })
})
