import {
  Account,
  Address,
  createAccount,
  hexToBytes,
  setLengthLeft,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { FlatStateManager } from '../src/index.ts'

describe('[StateManager/FlatStateManager]', () => {
  it('putSnapAccountsBatch() resolves getAccount() via address preimage', async () => {
    const sm = new FlatStateManager()
    const address = new Address(hexToBytes(`0x${'22'.repeat(20)}`))
    const accountHash = keccak_256(address.bytes)
    const account = createAccount({ nonce: 7n, balance: 1000n })
    sm.putSnapAccountsBatch([{ accountHash, account, address }])
    const loaded = await sm.getAccount(address)
    assert.strictEqual(loaded?.nonce, 7n)
  })

  it('checkpoint revert does not disturb untouched base keys', async () => {
    const sm = new FlatStateManager()
    const a1 = new Address(hexToBytes(`0x${'11'.repeat(20)}`))
    const a2 = new Address(hexToBytes(`0x${'22'.repeat(20)}`))
    await sm.putAccount(a1, createAccount({ nonce: 1n }))
    await sm.putAccount(a2, createAccount({ nonce: 2n }))
    await sm.checkpoint()
    await sm.putAccount(a1, createAccount({ nonce: 99n }))
    await sm.revert()
    assert.strictEqual((await sm.getAccount(a1))?.nonce, 1n)
    assert.strictEqual((await sm.getAccount(a2))?.nonce, 2n)
  })

  it('shallowCopy() isolates writes and reads parent updates', async () => {
    const base = new FlatStateManager()
    const addr = new Address(hexToBytes(`0x${'33'.repeat(20)}`))
    await base.putAccount(addr, createAccount({ balance: 1n }))
    const overlay = base.shallowCopy() as FlatStateManager
    await overlay.putAccount(addr, createAccount({ balance: 2n }))
    assert.strictEqual((await overlay.getAccount(addr))?.balance, 2n)
    assert.strictEqual((await base.getAccount(addr))?.balance, 1n)
    await base.putAccount(addr, createAccount({ balance: 3n }))
    assert.strictEqual((await overlay.getAccount(addr))?.balance, 2n)
  })

  it('putSnapStorageBatch() round-trips via getStorage()', async () => {
    const sm = new FlatStateManager()
    const address = new Address(hexToBytes(`0x${'44'.repeat(20)}`))
    const accountHash = keccak_256(address.bytes)
    await sm.putSnapAccountsBatch([{ accountHash, account: createAccount({ nonce: 1n }), address }])
    const slot = setLengthLeft(hexToBytes('0x01'), 32)
    const slotHash = keccak_256(slot)
    const value = setLengthLeft(hexToBytes('0xab'), 32)
    sm.putSnapStorageBatch(accountHash, [{ slotHash, value }])
    const read = await sm.getStorage(address, slot)
    assert.deepEqual(read, value)
  })
})
