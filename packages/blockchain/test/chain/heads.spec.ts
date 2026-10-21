import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  noteCanonicalPut,
  noteSideChainBody,
  rewindBlockHeadIfEquals,
  rewindHeadIfEquals,
  rewindIteratorHeadsIfEquals,
} from '../../src/chain/heads.ts'

const h = (n: number) => hexToBytes(`0x${n.toString(16).padStart(64, '0')}`)

describe('[Blockchain/chain/heads]', () => {
  it('noteCanonicalPut: header-only advances header head only', () => {
    const genesis = h(1)
    const header2 = h(2)
    const state = {
      headHeaderHash: genesis,
      headBlockHash: genesis,
      heads: {},
    }
    noteCanonicalPut(state, header2, false)
    assert.deepEqual(state.headHeaderHash, header2)
    assert.deepEqual(state.headBlockHash, genesis)
  })

  it('noteCanonicalPut: full block advances both heads', () => {
    const genesis = h(1)
    const block2 = h(2)
    const state = {
      headHeaderHash: genesis,
      headBlockHash: genesis,
      heads: {},
    }
    noteCanonicalPut(state, block2, true)
    assert.deepEqual(state.headHeaderHash, block2)
    assert.deepEqual(state.headBlockHash, block2)
  })

  it('noteSideChainBody: moves block head only', () => {
    const headerHead = h(0xaa)
    const blockHead = h(1)
    const sideBody = h(2)
    const state = {
      headHeaderHash: headerHead,
      headBlockHash: blockHead,
      heads: {},
    }
    noteSideChainBody(state, sideBody)
    assert.deepEqual(state.headHeaderHash, headerHead)
    assert.deepEqual(state.headBlockHash, sideBody)
  })

  it('rewindHeadIfEquals: updates only pointers that match stale hash', () => {
    const stale = h(0x10)
    const parent = h(0x11)
    const other = h(0x12)
    const state = {
      headHeaderHash: stale,
      headBlockHash: other,
      heads: {},
    }
    rewindHeadIfEquals(state, stale, parent)
    assert.deepEqual(state.headHeaderHash, parent)
    assert.deepEqual(state.headBlockHash, other)
  })

  it('rewindIteratorHeadsIfEquals: updates tagged heads on stale match', () => {
    const stale = h(0x20)
    const target = h(0x21)
    const state = {
      heads: { vm: stale, ok: h(0x22) },
    }
    rewindIteratorHeadsIfEquals(state, stale, target)
    assert.deepEqual(state.heads.vm, target)
    assert.deepEqual(state.heads.ok, h(0x22))
  })

  it('rewindBlockHeadIfEquals: block head only when it matched stale', () => {
    const stale = h(0x30)
    const target = h(0x31)
    const headerOnly = h(0x32)
    const state = {
      headHeaderHash: headerOnly,
      headBlockHash: stale,
      heads: {},
    }
    rewindBlockHeadIfEquals(state, stale, target)
    assert.deepEqual(state.headHeaderHash, headerOnly)
    assert.deepEqual(state.headBlockHash, target)
  })
})
