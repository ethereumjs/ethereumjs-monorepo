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

import type { Input } from '@ethereumjs/rlp'
import type { AccountData, PrefixedHexString } from '../../src/index.ts'

const _0n = BigInt(0)

describe('[Util/Account]: Account', () => {
  it('default constructor yields empty account', () => {
    const account = new Account()
    assert.strictEqual(account.nonce, _0n, 'should have zero nonce')
    assert.strictEqual(account.balance, _0n, 'should have zero balance')
    assert.strictEqual(
      bytesToHex(account.storageRoot),
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have storageRoot equal to KECCAK256_RLP',
    )
    assert.strictEqual(
      bytesToHex(account.codeHash),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have codeHash equal to KECCAK256_NULL',
    )
  })

  it('createAccountFromBytesArray() parses RLP fields', () => {
    const raw: PrefixedHexString[] = [
      '0x02', // nonce
      '0x0384', // balance
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', // storageRoot
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', // codeHash
    ]
    const account = createAccountFromBytesArray(raw.map((el) => hexToBytes(el)))

    assert.strictEqual(account.nonce, BigInt(2), 'should have correct nonce')
    assert.strictEqual(account.balance, BigInt(900), 'should have correct balance')
    assert.strictEqual(
      bytesToHex(account.storageRoot),
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot',
    )
    assert.strictEqual(
      bytesToHex(account.codeHash),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash',
    )
  })

  it('createAccount() parses AccountData', () => {
    const raw: AccountData = {
      nonce: '0x02',
      balance: '0x0384',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    const account = createAccount(raw)
    assert.strictEqual(account.nonce, BigInt(2), 'should have correct nonce')
    assert.strictEqual(account.balance, BigInt(900), 'should have correct balance')
    assert.strictEqual(
      bytesToHex(account.storageRoot),
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot',
    )
    assert.strictEqual(
      bytesToHex(account.codeHash),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash',
    )
  })

  it('createAccountFromRLP() parses serialized account', () => {
    const accountRlp = hexToBytes(
      '0xf84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    )
    const account = createAccountFromRLP(accountRlp)
    assert.strictEqual(account.nonce, BigInt(2), 'should have correct nonce')
    assert.strictEqual(account.balance, BigInt(900), 'should have correct balance')
    assert.strictEqual(
      bytesToHex(account.storageRoot),
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot',
    )
    assert.strictEqual(
      bytesToHex(account.codeHash),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash',
    )
  })

  it('serialize() matches RLP encoding', () => {
    const raw: AccountData = {
      nonce: '0x01',
      balance: '0x42',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    const account = createAccount(raw)
    const accountRlp = RLP.encode([raw.nonce, raw.balance, raw.storageRoot, raw.codeHash] as Input)

    assert.isTrue(equalsBytes(account.serialize(), accountRlp), 'should serialize correctly')
  })

  it('isContract() reflects codeHash', () => {
    const accountRlp = hexToBytes(
      '0xf84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    )
    let account = createAccountFromRLP(accountRlp)
    assert.isFalse(account.isContract(), 'should return false for a non-contract account')

    const raw: AccountData = {
      nonce: '0x01',
      balance: '0x0042',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    account = createAccount(raw)
    assert.isTrue(account.isContract(), 'should return true for a contract account')
  })

  it('isEmpty() reflects nonce balance storage and code', () => {
    let account = new Account()
    assert.isTrue(account.isEmpty(), 'should return true for an empty account')

    const raw: AccountData = {
      nonce: '0x01',
      balance: '0x0042',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b',
    }
    account = createAccount(raw)
    assert.isFalse(account.isEmpty(), 'should return false for a non-empty account')
  })

  it('constructor and factories reject invalid roots and negative values', () => {
    assert.throws(
      () => {
        new Account(undefined, undefined, hexToBytes('0xaaaa'), undefined)
      },
      undefined,
      undefined,
      'should only accept length 32 buffer for storageRoot',
    )

    assert.throws(
      () => {
        new Account(undefined, undefined, undefined, hexToBytes('0xaaaa'))
      },
      undefined,
      undefined,
      'should only accept length 32 buffer for codeHash',
    )

    const data = { balance: BigInt(5) }
    assert.throws(
      () => {
        createAccountFromRLP(data as any)
      },
      undefined,
      undefined,
      'should only accept an array in fromRlpSerializedAccount',
    )

    assert.throws(
      () => {
        new Account(BigInt(-5))
      },
      undefined,
      undefined,
      'should not accept nonce less than 0',
    )

    assert.throws(
      () => {
        new Account(undefined, BigInt(-5))
      },
      undefined,
      undefined,
      'should not accept balance less than 0',
    )
  })
})
