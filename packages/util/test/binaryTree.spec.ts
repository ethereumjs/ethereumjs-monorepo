import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { Account } from '../src/account.ts'
import { Address } from '../src/address.ts'
import {
  BINARY_TREE_CODE_OFFSET,
  BinaryTreeLeafType,
  chunkifyBinaryTreeCode,
  decodeBinaryTreeLeafBasicData,
  encodeBinaryTreeLeafBasicData,
  generateBinaryTreeChunkSuffixes,
  getBinaryTreeIndicesForCodeChunk,
  getBinaryTreeIndicesForStorageSlot,
  getBinaryTreeKey,
  getBinaryTreeKeyForCodeChunk,
  getBinaryTreeKeyForStorageSlot,
  getBinaryTreeStem,
} from '../src/binaryTree.ts'
import { hexToBytes } from '../src/bytes.ts'

const hashFn = (input: Uint8Array) => keccak_256(input)
const TEST_ADDRESS = new Address(hexToBytes(`0x${'11'.repeat(20)}`))

describe('[Util/BinaryTree]: indices and keys', () => {
  it('getBinaryTreeIndicesForStorageSlot() for header storage', () => {
    const { treeIndex, subIndex } = getBinaryTreeIndicesForStorageSlot(0n)
    assert.strictEqual(treeIndex, 0n)
    assert.strictEqual(subIndex, 64)
  })

  it('getBinaryTreeIndicesForCodeChunk()', () => {
    const { treeIndex, subIndex } = getBinaryTreeIndicesForCodeChunk(0)
    assert.strictEqual(treeIndex, 0)
    assert.strictEqual(subIndex, BINARY_TREE_CODE_OFFSET)
  })

  it('getBinaryTreeKey() for basic data and code hash leaves', () => {
    const stem = new Uint8Array(31).fill(1)
    const basicKey = getBinaryTreeKey(stem, BinaryTreeLeafType.BasicData)
    const codeHashKey = getBinaryTreeKey(stem, BinaryTreeLeafType.CodeHash)
    assert.strictEqual(basicKey.length, 32)
    assert.strictEqual(codeHashKey.length, 32)
    assert.notDeepEqual(basicKey, codeHashKey)
  })

  it('getBinaryTreeStem() and getBinaryTreeKeyForStorageSlot()', () => {
    const stem = getBinaryTreeStem(hashFn, TEST_ADDRESS, 0)
    assert.strictEqual(stem.length, 31)
    const key = getBinaryTreeKeyForStorageSlot(TEST_ADDRESS, 0n, hashFn)
    assert.strictEqual(key.length, 32)
  })

  it('getBinaryTreeKeyForCodeChunk()', () => {
    const key = getBinaryTreeKeyForCodeChunk(TEST_ADDRESS, 0, hashFn)
    assert.strictEqual(key.length, 32)
  })
})

describe('[Util/BinaryTree]: leaf data and code chunks', () => {
  it('encodeBinaryTreeLeafBasicData() / decodeBinaryTreeLeafBasicData() round-trip', () => {
    const account = new Account(5n, 1000n, undefined, undefined, 42, 1)
    const encoded = encodeBinaryTreeLeafBasicData(account)
    const decoded = decodeBinaryTreeLeafBasicData(encoded)
    assert.strictEqual(decoded.version, 1)
    assert.strictEqual(decoded.nonce, 5n)
    assert.strictEqual(decoded.balance, 1000n)
    assert.strictEqual(decoded.codeSize, 42)
  })

  it('chunkifyBinaryTreeCode() splits bytecode', () => {
    const code = hexToBytes('0x6001600101')
    const chunks = chunkifyBinaryTreeCode(code)
    assert.isTrue(chunks.length >= 1)
    assert.strictEqual(chunks[0].length, 32)
  })

  it('generateBinaryTreeChunkSuffixes()', () => {
    const suffixes = generateBinaryTreeChunkSuffixes(3)
    assert.deepEqual(suffixes, [128, 129, 130])
  })
})
