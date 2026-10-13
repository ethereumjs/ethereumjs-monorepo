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

describe('[Util/Account]: createPartialAccount', () => {
  it('createPartialAccount() throws when all fields are null', () => {
    assert.throws(
      () =>
        createPartialAccount({
          nonce: null,
          balance: null,
          storageRoot: null,
          codeHash: null,
          codeSize: null,
          version: null,
        }),
      'All partial fields null',
    )
  })

  it('createPartialAccount() builds full Account from provided fields', () => {
    const accountData = {
      nonce: 1n,
      balance: Units.ether(1),
      storageRoot: KECCAK256_RLP,
      codeHash: KECCAK256_RLP,
      codeSize: 10,
      version: 1,
    }
    const account = createPartialAccount(accountData)

    assert.deepEqual(
      account,
      new Account(
        accountData.nonce,
        accountData.balance,
        accountData.storageRoot,
        accountData.codeHash,
        accountData.codeSize,
        accountData.version,
      ),
    )
  })

  it('createPartialAccount() preserves null and undefined fields', () => {
    const accountData = {
      nonce: undefined,
      balance: Units.ether(1),
      storageRoot: undefined,
      codeHash: null,
      codeSize: 10,
      version: undefined,
    }
    const account = createPartialAccount(accountData)

    assert.deepEqual(
      account,
      new Account(
        accountData.nonce,
        accountData.balance,
        accountData.storageRoot,
        accountData.codeHash,
        accountData.codeSize,
        accountData.version,
      ),
    )
  })
})
