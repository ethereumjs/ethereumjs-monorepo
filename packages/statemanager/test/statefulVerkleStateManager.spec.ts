import { createAccount, createAddressFromPrivateKey, randomBytes } from '@ethereumjs/util'
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
    const address = createAddressFromPrivateKey(randomBytes(32))
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
    const address = createAddressFromPrivateKey(randomBytes(32))
    const code = hexToBytes('0x6001') // PUSH 01
    await sm.putCode(address, code)
    const retrievedCode = await sm.getCode(address)
    assert.deepEqual(code, retrievedCode)
  })
})
