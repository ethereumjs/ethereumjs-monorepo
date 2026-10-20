import { RLP } from '@ethereumjs/rlp'
import { assert, describe, it } from 'vitest'

import {
  Account,
  KECCAK256_NULL,
  KECCAK256_RLP,
  Units,
  accountBodyFromSlim,
  accountBodyToRLP,
  accountBodyToSlim,
  bigIntToBytes,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  createAccount,
  createAccountFromBytesArray,
  createAccountFromRLP,
  createPartialAccount,
  createPartialAccountFromRLP,
  equalsBytes,
  generateAddress,
  generateAddress2,
  hexToBytes,
  importPublic,
  intToBytes,
  intToHex,
  intToUnpaddedBytes,
  isValidAddress,
  isValidChecksumAddress,
  isValidPrivate,
  isValidPublic,
  padToEven,
  privateToAddress,
  privateToPublic,
  publicToAddress,
  toChecksumAddress,
  utf8ToBytes,
} from '../../src/index.ts'

import type { AccountBodyBytes } from '../../src/index.ts'

describe('[Util/Account]: account body slim and RLP', () => {
  it('accountBodyFromSlim() maps empty roots to canonical hashes', () => {
    const body: AccountBodyBytes = [
      new Uint8Array(8),
      new Uint8Array(8),
      new Uint8Array(0),
      new Uint8Array(0),
    ]
    const result = accountBodyFromSlim(body)
    assert.strictEqual(result.length, 4)
    assert.strictEqual(
      JSON.stringify(result[2]),
      JSON.stringify(KECCAK256_RLP),
      'Empty storageRoot should be changed to hash of RLP of null',
    )
    assert.strictEqual(
      JSON.stringify(result[3]),
      JSON.stringify(KECCAK256_NULL),
      'Empty codeRoot should be changed to hash of RLP of null',
    )
  })

  it('accountBodyToSlim() clears canonical default roots', () => {
    const body: AccountBodyBytes = [
      new Uint8Array(8),
      new Uint8Array(8),
      KECCAK256_RLP,
      KECCAK256_NULL,
    ]
    const result = accountBodyToSlim(body)
    assert.strictEqual(result.length, 4)
    assert.strictEqual(JSON.stringify(result[2]), JSON.stringify(new Uint8Array(0)))
    assert.strictEqual(JSON.stringify(result[3]), JSON.stringify(new Uint8Array(0)))
  })

  it('accountBodyToRLP() RLP-encodes body', () => {
    const body: AccountBodyBytes = [
      new Uint8Array(8),
      new Uint8Array(8),
      KECCAK256_RLP,
      KECCAK256_NULL,
    ]
    const result = accountBodyToRLP(body)
    assert.strictEqual(JSON.stringify(result), JSON.stringify(RLP.encode(body)))
  })
})
