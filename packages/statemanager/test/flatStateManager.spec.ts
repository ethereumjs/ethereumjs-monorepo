import {
  Account,
  Address,
  BINARY_ACCOUNT_SIZE,
  accountToBinaryAccount,
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

  it('getCodeByHash() returns bytecode stored via putCodeByHash()', () => {
    const sm = new FlatStateManager()
    const code = new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xfd])
    const codeHash = keccak_256(code)
    sm.putCodeByHash(codeHash, code)
    assert.deepEqual(sm.getCodeByHash(codeHash), code)
    assert.isUndefined(sm.getCodeByHash(new Uint8Array(32)))
  })

  it('putSnapBinaryAccountsBatch() and getBinaryAccountByHash()', async () => {
    const sm = new FlatStateManager()
    const address = new Address(hexToBytes(`0x${'55'.repeat(20)}`))
    const accountHash = keccak_256(address.bytes)
    const account = createAccount({ nonce: 3n, balance: 42n })
    const binary = accountToBinaryAccount(account)
    assert.strictEqual(binary.length, BINARY_ACCOUNT_SIZE)
    sm.putSnapBinaryAccountsBatch([{ accountHash, binaryAccount: binary, address }])
    const stored = sm.getBinaryAccountByHash(accountHash)
    assert.isDefined(stored)
    assert.deepEqual(stored, binary)
    assert.strictEqual((await sm.getAccount(address))?.nonce, 3n)
  })

  it('putSnapBinaryAccountsFromSlab() ingests 136-byte stride rows', () => {
    const sm = new FlatStateManager()
    const hash0 = new Uint8Array(32)
    hash0[0] = 0x00
    const hashFf = new Uint8Array(32)
    hashFf[0] = 0xff
    const binary0 = accountToBinaryAccount(createAccount({ nonce: 1n }))
    const binaryFf = accountToBinaryAccount(createAccount({ nonce: 2n }))
    const slab = new Uint8Array(2 * (32 + BINARY_ACCOUNT_SIZE))
    slab.set(hash0, 0)
    slab.set(binary0, 32)
    slab.set(hashFf, 32 + BINARY_ACCOUNT_SIZE)
    slab.set(binaryFf, 32 + BINARY_ACCOUNT_SIZE + 32)
    sm.putSnapBinaryAccountsFromSlab(slab)
    assert.equal(sm.accountCount(), 2)
    assert.isDefined(sm.getBinaryAccountByHash(hash0))
    assert.isDefined(sm.getBinaryAccountByHash(hashFf))
  })

  it('accountCount stays O(1) after bulk snap ingest without checkpoint', () => {
    const sm = new FlatStateManager()
    for (let i = 0; i < 10_000; i++) {
      const hash = new Uint8Array(32)
      hash[0] = i % 256
      hash[1] = (i >> 8) & 0xff
      sm.putSnapBinaryAccountsBatch([
        {
          accountHash: hash,
          binaryAccount: accountToBinaryAccount(createAccount({ nonce: BigInt(i) })),
        },
      ])
    }
    assert.equal(sm.accountCount(), 10_000)
    const t0 = performance.now()
    for (let i = 0; i < 1000; i++) {
      sm.accountCount()
    }
    assert.isBelow(performance.now() - t0, 5)
  })

  it('child overlay delete hides parent account in accountCount()', async () => {
    const base = new FlatStateManager()
    const addr = new Address(hexToBytes(`0x${'66'.repeat(20)}`))
    await base.putAccount(addr, createAccount({ nonce: 1n }))
    assert.equal(base.accountCount(), 1)
    const overlay = base.shallowCopy() as FlatStateManager
    await overlay.deleteAccount(addr)
    assert.equal(await overlay.getAccount(addr), undefined)
    assert.equal(overlay.accountCount(), 0)
    assert.equal(base.accountCount(), 1)
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
