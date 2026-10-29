import { RLP } from '@ethereumjs/rlp'
import { intToUnpaddedBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { encodeGetBlockHeaders } from '../../src/protocol/eth/codec.ts'
import { tryServeEthGet } from '../../src/serve/ethServer.ts'
import { RollingBlockStore } from '../../src/serve/rollingBlockStore.ts'

function makeChain(store: RollingBlockStore, start: bigint, count: number) {
  let parent = new Uint8Array(32)
  for (let i = 0; i < count; i++) {
    const n = start + BigInt(i)
    const hash = new Uint8Array(32)
    hash[31] = Number(n)
    const headerRlp = RLP.encode([parent, new Uint8Array(32), new Uint8Array(20)])
    store.put({
      number: n,
      hash,
      headerRlp,
      bodyRlp: RLP.encode([[], []]),
      receiptsEth69Rlp: RLP.encode([
        [intToUnpaddedBytes(0), intToUnpaddedBytes(1), intToUnpaddedBytes(21000), []],
      ]),
    })
    parent = hash
  }
}

describe('[DevP2P/Serve]: ethServer', () => {
  it('serveHeaders() by number ascending', () => {
    const store = new RollingBlockStore()
    makeChain(store, 10n, 3)
    const req = encodeGetBlockHeaders(
      69,
      {
        startBlock: intToUnpaddedBytes(10),
        limit: intToUnpaddedBytes(2),
        skip: intToUnpaddedBytes(0),
        reverse: intToUnpaddedBytes(0),
      },
      intToUnpaddedBytes(7),
    )
    const reply = tryServeEthGet(store, 69, 'GET_BLOCK_HEADERS', req, 2_000_000)
    assert.notEqual(reply, undefined)
    const decoded = RLP.decode(RLP.encode(reply!.rlp)) as unknown[]
    const headers = decoded[1] as unknown[]
    assert.equal(headers.length, 2)
  })

  it('serveBodies() skips missing hash', () => {
    const store = new RollingBlockStore()
    makeChain(store, 1n, 1)
    const only = store.getByNumber(1n)!
    const req = [intToUnpaddedBytes(1), [only.hash, new Uint8Array(32)]]
    const reply = tryServeEthGet(store, 69, 'GET_BLOCK_BODIES', req, 2_000_000)
    assert.notEqual(reply, undefined)
    const bodies = (RLP.decode(RLP.encode(reply!.rlp)) as unknown[])[1] as unknown[]
    assert.equal(bodies.length, 1)
  })

  it('serveReceipts() eth/69 envelope', () => {
    const store = new RollingBlockStore()
    makeChain(store, 1n, 1)
    const h = store.getByNumber(1n)!.hash
    const req = [intToUnpaddedBytes(2), [h]]
    const reply = tryServeEthGet(store, 69, 'GET_RECEIPTS', req, 2_000_000)
    assert.notEqual(reply, undefined)
    const outer = RLP.decode(RLP.encode(reply!.rlp)) as unknown[]
    assert.equal(outer.length, 2)
  })

  it('serveReceipts() eth/70 paginates with lastBlockIncomplete', () => {
    const store = new RollingBlockStore()
    makeChain(store, 1n, 1)
    const h = store.getByNumber(1n)!.hash
    const req = [intToUnpaddedBytes(2), intToUnpaddedBytes(1), [h]]
    const reply = tryServeEthGet(store, 70, 'GET_RECEIPTS', req, 1)
    assert.notEqual(reply, undefined)
  })

  it('all-miss returns undefined', () => {
    const store = new RollingBlockStore()
    const req = [intToUnpaddedBytes(1), [new Uint8Array(32)]]
    assert.equal(tryServeEthGet(store, 69, 'GET_BLOCK_BODIES', req, 2_000_000), undefined)
  })
})
