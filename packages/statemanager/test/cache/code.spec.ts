import { Address, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CacheType, CodeCache } from '../../src/cache/index.js'

describe('Code Cache: initialization', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    it(`should initialize`, async () => {
      const cache = new CodeCache({ size: 100, type })

      assert.equal(cache._checkpoints, 0, 'initializes given code cache')
    })
  }
})

describe('Code Cache: put and get code', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new CodeCache({ size: 100, type })

    const addr = new Address(hexToBytes(`0x${'10'.repeat(20)}`))
    const code = hexToBytes('0xdeadbeef') // Example code

    it('should return undefined for code if not present in the cache', async () => {
      const elem = cache.get(addr)
      assert.ok(elem === undefined)
    })

    it(`should put code`, async () => {
      cache.put(addr, code)
      const elem = cache.get(addr)
      assert.ok(elem !== undefined && elem.code && equalsBytes(elem.code, code))
    })

    it(`should flush`, async () => {
      const items = cache.flush()
      assert.equal(items.length, 1)
    })

    it(`should delete code from cache`, async () => {
      cache.del(addr)

      const elem = cache.get(addr)
      assert.ok(elem !== undefined && elem.code === undefined)
    })
  }
})

describe('Code Cache: checkpointing', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new CodeCache({ size: 100, type })

    const addr = new Address(hexToBytes(`0x${'10'.repeat(20)}`))
    const code1 = hexToBytes('0xdeadbeef') // Example code
    const code2 = hexToBytes('0x00ff00ff') // Example code

    it(`should revert to correct state`, async () => {
      cache.put(addr, code1)
      cache.checkpoint()
      cache.put(addr, code2)

      let elem = cache.get(addr)
      assert.ok(elem !== undefined && elem.code && equalsBytes(elem.code, code2))

      cache.revert()

      elem = cache.get(addr)
      assert.ok(elem !== undefined && elem.code && equalsBytes(elem.code, code1))
    })

    it(`cache clearing`, async () => {
      const cache = new CodeCache({ size: 100, type: CacheType.LRU })

      cache.put(addr, code1)
      cache.clear()
      assert.equal(cache.size(), 0, 'should delete cache objects with clear=true')
    })
  }
})
