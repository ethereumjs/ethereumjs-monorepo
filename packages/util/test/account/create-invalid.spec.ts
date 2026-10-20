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

import { eip1404ExamplesData } from '../testdata/eip1014Examples.ts'

const ACCOUNT_ROOTS = {
  storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
} as const

const JUNK_NUMERIC_INPUTS: unknown[] = [
  10.1,
  '10.1',
  -1,
  BigInt(-1),
  '-1',
  NaN,
  Infinity,
  -Infinity,
  {},
  true,
]

describe('[Util/Account]: createAccount invalid inputs', () => {
  for (const junk of JUNK_NUMERIC_INPUTS) {
    it(`createAccount() rejects junk nonce: ${String(junk)}`, () => {
      assert.throws(() =>
        createAccount({
          nonce: junk as never,
          balance: '0x0',
          ...ACCOUNT_ROOTS,
        }),
      )
    })

    it(`createAccount() rejects junk balance: ${String(junk)}`, () => {
      assert.throws(() =>
        createAccount({
          nonce: '0x0',
          balance: junk as never,
          ...ACCOUNT_ROOTS,
        }),
      )
    })
  }
})
