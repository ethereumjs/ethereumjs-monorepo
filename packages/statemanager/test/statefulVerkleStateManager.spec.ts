import { createAccount, createAddressFromString, matchingBytesLength } from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { StatefulVerkleStateManager } from '../src/statefulVerkleStateManager.js'

import type { VerkleCrypto } from '@ethereumjs/util'

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
    await sm.deleteAccount(address)
    const deletedAccount = await sm.getAccount(address)
    assert.ok(deletedAccount?.isEmpty())
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
      (await import('./testdata/biggestContractEver.json')).default.bytecode,
    )
    // Biggest mainnet contract - 0x10C621008B210C3A5d0385e458B48af05BF4Ec88 (supposedly anyway)
    await sm.putCode(address, reallyBigByteCode)
    const retrievedReallyBigByteCode = await sm.getCode(address)

    assert.equal(
      matchingBytesLength(retrievedReallyBigByteCode, reallyBigByteCode),
      reallyBigByteCode.length,
    )
  })
})
