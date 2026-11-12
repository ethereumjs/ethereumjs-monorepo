import {
  Account,
  Address,
  BINARY_ACCOUNT_SIZE,
  accountToBinaryAccount,
  bytesToHex,
  createAccount,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
  setLengthLeft,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { consumeBAL } from '../src/consumeBAL.ts'
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

  it('overlayMutations() lists overlay storage writes only on child', async () => {
    const base = new FlatStateManager()
    assert.deepEqual(base.overlayMutations(), { storage: [], accounts: [] })
    const overlay = base.shallowCopy() as FlatStateManager
    const addr = new Address(hexToBytes(`0x${'44'.repeat(20)}`))
    await overlay.putAccount(addr, createAccount({ nonce: 1n }))
    const slot = setLengthLeft(hexToBytes('0x01'), 32)
    const val = setLengthLeft(hexToBytes('0x02'), 32)
    await overlay.putStorage(addr, slot, val)
    const mut = overlay.overlayMutations()
    assert.isAtLeast(mut.accounts.length, 1)
    assert.isAtLeast(mut.storage.length, 1)
    assert.deepEqual(base.overlayMutations(), { storage: [], accounts: [] })
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

  it('coldCodeLookup hydrates getCodeByHash() and caches without second lookup', async () => {
    const code = new Uint8Array([0x60, 0x01, 0x60, 0x01, 0xfd])
    const codeHash = keccak_256(code)
    let calls = 0
    const sm = new FlatStateManager({
      coldCodeLookup: (h) => {
        calls++
        if (!equalsBytes(h, codeHash)) return undefined
        return code
      },
    })
    assert.deepEqual(sm.getCodeByHash(codeHash), code)
    assert.strictEqual(calls, 1)
    assert.deepEqual(sm.getCodeByHash(codeHash), code)
    assert.strictEqual(calls, 1)
    const addr = new Address(hexToBytes(`0x${'77'.repeat(20)}`))
    await sm.putAccount(addr, createAccount({ codeHash }))
    assert.deepEqual(await sm.getCode(addr), code)
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

  it('maxResidentAccounts evicts snap keys but keeps logical accountCount()', () => {
    const sm = new FlatStateManager({ maxResidentAccounts: 100 })
    for (let i = 0; i < 1_000; i++) {
      const hash = new Uint8Array(32)
      hash[0] = i % 256
      hash[1] = (i >> 8) & 0xff
      hash[2] = (i >> 16) & 0xff
      sm.putSnapBinaryAccountsBatch([
        {
          accountHash: hash,
          binaryAccount: accountToBinaryAccount(createAccount({ nonce: BigInt(i) })),
        },
      ])
    }
    assert.equal(sm.accountCount(), 1_000)
    assert.isAtMost(sm.residentAccountCount(), 100)
    const evicted = new Uint8Array(32)
    evicted[0] = 0
    evicted[1] = 0
    evicted[2] = 0
    assert.isUndefined(sm.getBinaryAccountByHash(evicted))
  })

  it('pinned putAccount survives maxResidentAccounts eviction', async () => {
    const sm = new FlatStateManager({ maxResidentAccounts: 2 })
    const addr = new Address(hexToBytes(`0x${'77'.repeat(20)}`))
    await sm.putAccount(addr, createAccount({ nonce: 99n }))
    for (let i = 0; i < 10; i++) {
      const hash = new Uint8Array(32)
      hash[0] = 0xaa
      hash[31] = i
      sm.putSnapBinaryAccountsBatch([
        {
          accountHash: hash,
          binaryAccount: accountToBinaryAccount(createAccount({ nonce: 1n })),
        },
      ])
    }
    assert.isDefined(await sm.getAccount(addr))
    assert.equal((await sm.getAccount(addr))?.nonce, 99n)
  })

  it('setSyncedAccountCount() then tail ingest adjusts logical total', () => {
    const sm = new FlatStateManager({ maxResidentAccounts: 50_000 })
    sm.setSyncedAccountCount(50_000)
    for (let i = 0; i < 10; i++) {
      const hash = new Uint8Array(32)
      hash[0] = 0xbb
      hash[31] = i
      sm.putSnapBinaryAccountsBatch([
        {
          accountHash: hash,
          binaryAccount: accountToBinaryAccount(createAccount({ nonce: 1n })),
        },
      ])
    }
    assert.equal(sm.accountCount(), 50_010)
  })

  it('consumeBAL() on cold-disk account preserves balance and codeHash on nonce-only delta', async () => {
    const addr = createAddressFromString(`0x${'dd'.repeat(20)}`)
    const coldHash = keccak_256(addr.bytes)
    const codeHash = keccak_256(new Uint8Array([1, 2, 3]))
    const coldBinary = accountToBinaryAccount(
      createAccount({ balance: 10_000_000_000_000_000_000n, nonce: 1n, codeHash }),
    )
    const sm = new FlatStateManager({
      maxResidentAccounts: 1,
      coldAccountLookup: (h) => {
        if (h.length === 32 && h.every((b, i) => b === coldHash[i]))
          return new Uint8Array(coldBinary)
        return undefined
      },
    })
    sm.setSyncedAccountCount(1)
    await consumeBAL(sm, [
      {
        address: addr.toString(),
        balanceChanges: [],
        nonceChanges: [{ blockAccessIndex: '0x0', postNonce: '0x2' }],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ])
    const loaded = await sm.getAccount(addr)
    assert.isDefined(loaded)
    assert.equal(loaded!.balance, 10_000_000_000_000_000_000n)
    assert.equal(loaded!.nonce, 2n)
    assert.equal(bytesToHex(loaded!.codeHash), bytesToHex(codeHash))
    assert.equal(sm.accountCount(), 1)
    assert.equal(sm.residentAccountCount(), 1)
  })

  it('coldAccountLookup promotes without bumping logical count', () => {
    const coldHash = new Uint8Array(32)
    coldHash[0] = 0xcc
    const coldBinary = accountToBinaryAccount(createAccount({ balance: 5n }))
    const sm = new FlatStateManager({
      maxResidentAccounts: 10,
      coldAccountLookup: (h) => {
        if (h[0] === coldHash[0]) return new Uint8Array(coldBinary)
        return undefined
      },
    })
    sm.setSyncedAccountCount(1)
    const got = sm.getBinaryAccountByHash(coldHash)
    assert.isDefined(got)
    assert.equal(got!.length, BINARY_ACCOUNT_SIZE)
    assert.equal(sm.accountCount(), 1)
    assert.equal(sm.residentAccountCount(), 1)
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

  it('coldStorageLookup hydrates getStorage() and caches without second lookup', async () => {
    const address = new Address(hexToBytes(`0x${'88'.repeat(20)}`))
    const accountHash = keccak_256(address.bytes)
    const slot = setLengthLeft(hexToBytes('0x02'), 32)
    const slotHash = keccak_256(slot)
    const value = setLengthLeft(hexToBytes('0xcd'), 32)
    let calls = 0
    const sm = new FlatStateManager({
      coldAccountLookup: (h) => {
        if (equalsBytes(h, accountHash)) {
          return accountToBinaryAccount(createAccount({ nonce: 1n }))
        }
        return undefined
      },
      coldStorageLookup: (acc, sl) => {
        calls++
        if (equalsBytes(acc, accountHash) && equalsBytes(sl, slotHash)) return value
        return undefined
      },
    })
    const read = await sm.getStorage(address, slot)
    assert.deepEqual(read, value)
    assert.strictEqual(calls, 1)
    const read2 = await sm.getStorage(address, slot)
    assert.deepEqual(read2, value)
    assert.strictEqual(calls, 1)
  })

  it('coldStorageLookup miss leaves getStorage() empty', async () => {
    const address = new Address(hexToBytes(`0x${'89'.repeat(20)}`))
    const accountHash = keccak_256(address.bytes)
    const sm = new FlatStateManager({
      coldAccountLookup: (h) => {
        if (equalsBytes(h, accountHash)) {
          return accountToBinaryAccount(createAccount({}))
        }
        return undefined
      },
      coldStorageLookup: () => undefined,
    })
    const slot = setLengthLeft(hexToBytes('0x03'), 32)
    const read = await sm.getStorage(address, slot)
    assert.deepEqual(read, new Uint8Array(0))
  })

  it('putStorage() after cold hydrate is not evicted by cold cache trim', async () => {
    const address = new Address(hexToBytes(`0x${'8a'.repeat(20)}`))
    const accountHash = keccak_256(address.bytes)
    const written = setLengthLeft(hexToBytes('0xfe'), 32)
    const slot = setLengthLeft(hexToBytes('0x04'), 32)
    const slotHash = keccak_256(slot)
    const filler = setLengthLeft(hexToBytes('0x01'), 32)
    const sm = new FlatStateManager({
      maxResidentAccounts: 1,
      coldAccountLookup: () => accountToBinaryAccount(createAccount({})),
      coldStorageLookup: (a, s) => {
        if (equalsBytes(a, accountHash) && equalsBytes(s, slotHash)) {
          return written
        }
        return filler
      },
    })
    await sm.getStorage(address, slot)
    const live = setLengthLeft(hexToBytes('0xaa'), 32)
    await sm.putStorage(address, slot, live)
    for (let i = 0; i < 4104; i++) {
      const other = new Address(
        setLengthLeft(hexToBytes(`0x${(0xb0 + (i % 16)).toString(16)}`), 20),
      )
      const s = setLengthLeft(hexToBytes(`0x${i.toString(16).padStart(2, '0')}`), 32)
      await sm.getStorage(other, s)
    }
    assert.deepEqual(await sm.getStorage(address, slot), live)
  })

  it('zeroing a cold-hydrated or parent storage slot records a tombstone and does not resurrect', async () => {
    const address = new Address(setLengthLeft(hexToBytes('0x99'), 20))
    const accountHash = keccak_256(address.bytes)
    const slot = setLengthLeft(hexToBytes('0x07'), 32)
    const slotHash = keccak_256(slot)
    const coldVal = setLengthLeft(hexToBytes('0xdeadbeef'), 32)
    let coldLookups = 0
    const sm = new FlatStateManager({
      coldAccountLookup: (h) =>
        equalsBytes(h, accountHash) ? accountToBinaryAccount(createAccount({})) : undefined,
      coldStorageLookup: (a, s) => {
        if (equalsBytes(a, accountHash) && equalsBytes(s, slotHash)) {
          coldLookups++
          return coldVal
        }
        return undefined
      },
    })
    assert.deepEqual(await sm.getStorage(address, slot), coldVal)
    assert.strictEqual(coldLookups, 1)

    // Zeroing on a shallowCopy overlay does not read parent's non-zero value
    const overlay = sm.shallowCopy()
    await overlay.putStorage(address, slot, new Uint8Array(0))
    assert.deepEqual(await overlay.getStorage(address, slot), new Uint8Array(0))
    assert.deepEqual(await sm.getStorage(address, slot), coldVal)

    // Zeroing on root manager does not resurrect from coldStorageLookup
    await sm.putStorage(address, slot, new Uint8Array(0))
    assert.deepEqual(await sm.getStorage(address, slot), new Uint8Array(0))
    assert.strictEqual(coldLookups, 1)
  })
})
