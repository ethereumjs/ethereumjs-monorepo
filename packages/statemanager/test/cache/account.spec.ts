import { Account, Address, equalsBytes, hexStringToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { AccountCache, CacheType } from '../../src/cache/index.js'
import { createAccount } from '../util.js'

describe('Account Cache: initialization', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    it(`should initialize`, async () => {
      const cache = new AccountCache({ size: 100, type })

      assert.equal(cache._checkpoints, 0, 'initializes given trie')
    })
  }
})

describe('Account Cache: put and get account', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new AccountCache({ size: 100, type })

    const addr = new Address(hexStringToBytes('10'.repeat(20)))
    const acc: Account = createAccount(BigInt(1), BigInt(0xff11))
    const accRLP = acc.serialize()

    it('should return undefined for CacheElement if account not present in the cache', async () => {
      const elem = cache.get(addr)
      assert.ok(elem === undefined)
    })

    it(`should put account`, async () => {
      cache.put(addr, acc)
      const elem = cache.get(addr)
      assert.ok(elem !== undefined && elem.accountRLP && equalsBytes(elem.accountRLP, accRLP))
    })

    it(`should flush`, async () => {
      const items = cache.flush()
      assert.equal(items.length, 1)
    })

    it(`should delete account from cache`, async () => {
      cache.del(addr)

      const elem = cache.get(addr)
      assert.ok(elem !== undefined && elem.accountRLP === undefined)
    })
  }
})

describe('Account Cache: checkpointing', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new AccountCache({ size: 100, type })

    const addr = new Address(hexStringToBytes('10'.repeat(20)))
    const acc = createAccount(BigInt(1), BigInt(0xff11))
    const accRLP = acc.serialize()

    const updatedAcc = createAccount(BigInt(0x00), BigInt(0xff00))
    const updatedAccRLP = updatedAcc.serialize()

    it(`should revert to correct state`, async () => {
      cache.put(addr, acc)
      cache.checkpoint()
      cache.put(addr, updatedAcc)

      let elem = cache.get(addr)
      assert.ok(
        elem !== undefined && elem.accountRLP && equalsBytes(elem.accountRLP, updatedAccRLP)
      )

      cache.revert()

      elem = cache.get(addr)
      assert.ok(elem !== undefined && elem.accountRLP && equalsBytes(elem.accountRLP, accRLP))
    })

    it(`should use outer revert`, async () => {
      const cache = new AccountCache({ size: 100, type: CacheType.LRU })

      const account1 = new Account(undefined, 1n)
      cache.checkpoint()
      cache.put(addr, account1)
      cache.checkpoint()
      cache.put(addr, account1)
      cache.commit()
      cache.revert()
      const accCmp = cache.get(addr)
      assert.ok(accCmp === undefined)
    })

    it(`cache clearing`, async () => {
      const cache = new AccountCache({ size: 100, type: CacheType.LRU })
      cache.put(addr, acc)
      cache.clear()
      assert.equal(cache.size(), 0, 'should delete cache objects with clear=true')
    })
  }
})
