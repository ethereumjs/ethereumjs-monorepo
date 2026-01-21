import { Common, Mainnet } from '@ethereumjs/common'
import {
  Account,
  BinaryTreeLeafType,
  bigIntToBytes,
  createAccount,
  createAddressFromString,
  getBinaryTreeStem,
  hexToBytes,
  matchingBytesLength,
  setLengthLeft,
} from '@ethereumjs/util'
import { blake3 } from '@noble/hashes/blake3.js'
import { assert, describe, it } from 'vitest'

import { Caches } from '../src/index.ts'
import { StatefulBinaryTreeStateManager } from '../src/statefulBinaryTreeStateManager.ts'

import type { PrefixedHexString } from '@ethereumjs/util'

const hashFunction = blake3

describe('Binary Tree API tests', () => {
  it('should put/get/delete an account (with no storage/code from the trie)', async () => {
    const common = new Common({
      chain: Mainnet,
      eips: [7864],
    })
    const sm = new StatefulBinaryTreeStateManager({ common })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xfffn })
    await sm.putAccount(address, account)
    const retrievedAccount = await sm.getAccount(address)
    assert.strictEqual(retrievedAccount?.balance, account.balance)
    assert.strictEqual(retrievedAccount?.nonce, account.nonce)
    await sm.deleteAccount(address)
    const deletedAccount = await sm.getAccount(address)
    assert.strictEqual(deletedAccount, undefined)
  })

  it('should put and get code', async () => {
    const common = new Common({
      chain: Mainnet,
      eips: [7864],
    })
    const sm = new StatefulBinaryTreeStateManager({ common })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const code = hexToBytes('0x6001') // PUSH 01
    await sm.putCode(address, code)
    const retrievedCode = await sm.getCode(address)
    assert.deepEqual(code, retrievedCode)
    const bigByteCode = hexToBytes(
      '0x7faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ) // PUSH32 aa.....
    await sm.putCode(address, bigByteCode)
    const retrievedBigByteCode = await sm.getCode(address)
    assert.deepEqual(bigByteCode, retrievedBigByteCode)
    const reallyBigByteCode = hexToBytes(
      (await import('./testdata/biggestContractEver.ts')).biggestContractEverData
        .bytecode as PrefixedHexString,
    )
    // Biggest mainnet contract - 0x10C621008B210C3A5d0385e458B48af05BF4Ec88 (supposedly anyway)
    await sm.putCode(address, reallyBigByteCode)
    const retrievedReallyBigByteCode = await sm.getCode(address)

    assert.strictEqual(
      matchingBytesLength(retrievedReallyBigByteCode, reallyBigByteCode),
      reallyBigByteCode.length,
    )
  }, 120_000)

  it('should put and get storage', async () => {
    const zeroSlot = setLengthLeft(bigIntToBytes(0n), 32)
    const zeroSlotValue = hexToBytes('0x1')
    const common = new Common({
      chain: Mainnet,
      eips: [7864],
    })
    const sm = new StatefulBinaryTreeStateManager({ common })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    await sm.putAccount(address, new Account(0n, 1n))
    await sm.putStorage(address, zeroSlot, zeroSlotValue)
    const retrievedValue = await sm.getStorage(address, zeroSlot)
    assert.deepEqual(retrievedValue, setLengthLeft(zeroSlotValue, 32))
  })
})

describe('caching functionality works', () => {
  it('should cache accounts and then write to trie', async () => {
    const common = new Common({
      chain: Mainnet,
      eips: [7864],
    })
    const sm = new StatefulBinaryTreeStateManager({
      common,
      caches: new Caches(),
    })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xfffn })
    await sm.putAccount(address, account)

    // Confirm account doesn't exist in trie
    const stem = getBinaryTreeStem(hashFunction, address, 0)
    const accountData = await sm['_tree'].get(stem, [
      BinaryTreeLeafType.BasicData,
      BinaryTreeLeafType.CodeHash,
    ])
    assert.strictEqual(accountData[0], undefined, 'account does not exist in trie')

    // Confirm account exists in cache
    const cachedAccount = sm['_caches']?.account?.get(address)
    assert.deepEqual(cachedAccount?.accountRLP, account.serializeWithPartialInfo())

    // Flush account to trie
    await sm.checkpoint()
    await sm.commit()
    await sm.flush()
    const retrievedAccount = await sm.getAccount(address)
    assert.strictEqual(retrievedAccount?.balance, account.balance)

    // Delete account
    await sm.deleteAccount(address)
    await sm.checkpoint()
    await sm.commit()
    await sm.flush()
    const deletedAccount = await sm.getAccount(address)
    assert.strictEqual(deletedAccount, undefined)
  })
})
