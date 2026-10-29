import { RLP } from '@ethereumjs/rlp'
import { assert, describe, it } from 'vitest'

import { RollingBlockStore } from '../../src/serve/rollingBlockStore.ts'

import type { Input } from '@ethereumjs/rlp'

function bundle(n: bigint, parent?: Uint8Array) {
  const hash = new Uint8Array(32)
  hash[31] = Number(n)
  const headerFields: Input = [parent ?? new Uint8Array(32), new Uint8Array(32), new Uint8Array(20)]
  const headerRlp = RLP.encode(headerFields)
  return {
    number: n,
    hash,
    headerRlp,
    bodyRlp: RLP.encode([[], []]),
    receiptsEth69Rlp: RLP.encode([]),
  }
}

describe('[DevP2P/Serve]: RollingBlockStore', () => {
  it('contiguousRange() spans #100..#102', () => {
    const store = new RollingBlockStore(64)
    store.put(bundle(100n))
    store.put(bundle(101n, bundle(100n).hash))
    store.put(bundle(102n, bundle(101n).hash))
    const r = store.contiguousRange()
    assert.equal(r?.earliestBlock, 100n)
    assert.equal(r?.latestBlock, 102n)
  })

  it('contiguousRange() stops at a gap (#104 only)', () => {
    const store = new RollingBlockStore(64)
    store.put(bundle(104n))
    const r = store.contiguousRange()
    assert.equal(r?.earliestBlock, 104n)
    assert.equal(r?.latestBlock, 104n)
  })

  it('evicts lowest block and shrinks earliest', () => {
    const store = new RollingBlockStore(2)
    store.put(bundle(1n))
    store.put(bundle(2n, bundle(1n).hash))
    store.put(bundle(3n, bundle(2n).hash))
    const r = store.contiguousRange()
    assert.equal(r?.earliestBlock, 2n)
    assert.equal(r?.latestBlock, 3n)
  })

  it('put() replaces same number with new hash index', () => {
    const store = new RollingBlockStore(8)
    store.put(bundle(5n))
    const h2 = new Uint8Array(32)
    h2[0] = 0xaa
    store.put({ ...bundle(5n), hash: h2 })
    assert.notEqual(store.getByNumber(5n)?.hash[0], bundle(5n).hash[0])
    assert.equal(store.getByHash(h2)?.number, 5n)
  })
})
