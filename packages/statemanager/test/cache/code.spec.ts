import { bytesToHex, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
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

    const code = hexToBytes('0xdeadbeef') // Example code
    const codeHash = bytesToHex(keccak256(code))

    it('should return undefined for code if not present in the cache', async () => {
      const elem = cache.get(codeHash)
      assert.ok(elem === undefined)
    })

    it(`should put code`, async () => {
      cache.put(codeHash, code)
      const elem = cache.get(codeHash)
      assert.ok(elem !== undefined && elem.code && equalsBytes(elem.code, code))
    })

    it(`should flush`, async () => {
      const items = cache.flush()
      assert.equal(items.length, 1)
    })

    it(`should delete code from cache`, async () => {
      cache.del(codeHash)

      const elem = cache.get(codeHash)
      assert.ok(elem !== undefined && elem.code === undefined)
    })
  }
})

describe('Code Cache: checkpointing', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new CodeCache({ size: 100, type })

    const code1 = hexToBytes('0xdeadbeef') // Example code
    const code1Hash = bytesToHex(keccak256(code1))

    const code2 = hexToBytes('0x00ff00ff') // Example code
    const code2Hash = bytesToHex(keccak256(code2))

    it(`should revert to correct state`, async () => {
      cache.put(code1Hash, code1)
      cache.checkpoint()
      cache.put(code2Hash, code2)

      let elem = cache.get(code1Hash)
      assert.ok(elem !== undefined && elem.code && equalsBytes(elem.code, code1))
      elem = cache.get(code2Hash)
      assert.ok(elem !== undefined && elem.code && equalsBytes(elem.code, code2))

      cache.revert()

      elem = cache.get(code1Hash)
      assert.ok(elem !== undefined && elem.code && equalsBytes(elem.code, code1))
      elem = cache.get(code2Hash)
      assert.ok(elem === undefined)
    })

    it(`cache clearing`, async () => {
      const cache = new CodeCache({ size: 100, type: CacheType.LRU })

      const code = hexToBytes('0xdeadbeef') // Example code
      const codeHash = bytesToHex(keccak256(code))
      cache.put(codeHash, code)
      cache.clear()
      assert.equal(cache.size(), 0, 'should delete cache objects with clear=true')
    })
  }
})
