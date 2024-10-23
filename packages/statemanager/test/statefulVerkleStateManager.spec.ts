import {
  Account,
  VerkleLeafType,
  bigIntToBytes,
  createAccount,
  createAddressFromString,
  getVerkleStem,
  hexToBytes,
  matchingBytesLength,
  setLengthLeft,
} from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { Caches } from '../src/index.js'
import { StatefulVerkleStateManager } from '../src/statefulVerkleStateManager.js'

import type { PrefixedHexString, VerkleCrypto } from '@ethereumjs/util'

describe('Verkle Tree API tests', () => {
  let verkleCrypto: VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('should put/get/delete an account (with no storage/code from the trie', async () => {
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ trie, verkleCrypto })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xfffn })
    await sm.putAccount(address, account)
    const retrievedAccount = await sm.getAccount(address)
    assert.equal(retrievedAccount?.balance, account.balance)
    assert.equal(retrievedAccount?.nonce, account.nonce)
    await sm.deleteAccount(address)
    const deletedAccount = await sm.getAccount(address)
    assert.equal(deletedAccount, undefined)
  })
  it('should put and get code', async () => {
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ trie, verkleCrypto })
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
      (await import('./testdata/biggestContractEver.js')).biggestContractEverData
        .bytecode as PrefixedHexString,
    )
    // Biggest mainnet contract - 0x10C621008B210C3A5d0385e458B48af05BF4Ec88 (supposedly anyway)
    await sm.putCode(address, reallyBigByteCode)
    const retrievedReallyBigByteCode = await sm.getCode(address)

    assert.equal(
      matchingBytesLength(retrievedReallyBigByteCode, reallyBigByteCode),
      reallyBigByteCode.length,
    )
  })
  it('should put and get storage', async () => {
    const zeroSlot = setLengthLeft(bigIntToBytes(0n), 32)
    const zeroSlotValue = hexToBytes('0x1')
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ trie, verkleCrypto })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    await sm.putAccount(address, new Account(0n, 1n))
    await sm.putStorage(address, zeroSlot, zeroSlotValue)
    const retrievedValue = await sm.getStorage(address, zeroSlot)
    assert.deepEqual(retrievedValue, zeroSlotValue)
  })
})

describe('caching functionality works', () => {
  let verkleCrypto: VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('should cache accounts and then write to trie', async () => {
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ trie, verkleCrypto, caches: new Caches() })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xfffn })
    await sm.putAccount(address, account)

    // Confirm account doesn't exist in trie
    const stem = getVerkleStem(verkleCrypto, address, 0)
    const accountData = await sm['_trie'].get(stem, [
      VerkleLeafType.BasicData,
      VerkleLeafType.CodeHash,
    ])
    assert.equal(accountData[0], undefined, 'account does not exist in trie')

    // Confirm account exists in cache
    const cachedAccount = sm['_caches']?.account?.get(address)
    assert.deepEqual(cachedAccount?.accountRLP, account.serializeWithPartialInfo())

    // Flush account to trie
    await sm.checkpoint()
    await sm.commit()
    await sm.flush()
    const retrievedAccount = await sm.getAccount(address)
    assert.equal(retrievedAccount?.balance, account.balance)

    // Delete account
    await sm.deleteAccount(address)
    await sm.checkpoint()
    await sm.commit()
    await sm.flush()
    const deletedAccount = await sm.getAccount(address)
    assert.equal(deletedAccount, undefined)
  })
})
