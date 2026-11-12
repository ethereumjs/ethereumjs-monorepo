import { createAddressFromString } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  assignBuckets,
  bucketNibbleFromAddress,
  bucketPivotMinMax,
  peersOnSnapshot,
  shouldApplyBalAtBlock,
} from '../src/sync/ethySeederSchedule.ts'
import {
  DEFAULT_MAX_SWARM_TAIL_BLOCKS,
  preferCanonicalSnapOverEthy,
} from '../src/sync/syncSourceSelector.ts'

const ROOT_A = new Uint8Array(32).fill(0x0a)
const ROOT_B = new Uint8Array(32).fill(0x0b)

function seeder(
  id: string,
  block: bigint,
  root: Uint8Array,
  mask: number,
  balTo: bigint,
): import('../src/sync/ethySeederSchedule.ts').EthySeederDescriptor {
  return {
    peerId: id,
    basePivotBlock: block,
    basePivotRoot: root,
    bucketsBitmask: mask,
    balEarliestBlock: block + 1n,
    balLatestBlock: balTo,
  }
}

describe('[Ethy/Sync]: ethy seeder schedule', () => {
  it('assignBuckets prefers fresher snapshot', () => {
    const old = seeder('old', 100n, ROOT_A, 0xffff, 200n)
    const fresh = seeder('new', 132n, ROOT_B, 0xffff, 200n)
    const a = assignBuckets([old, fresh])
    assert.ok(a !== undefined)
    for (let b = 0; b < 16; b++) {
      assert.equal(a.assignments.get(b)?.basePivotBlock, 132n)
    }
  })

  it('assignBuckets keeps both peers on same snapshot', () => {
    const a = seeder('a', 100n, ROOT_A, 0xffff, 200n)
    const b = seeder('b', 100n, ROOT_A, 0xffff, 200n)
    assert.equal(peersOnSnapshot([a, b], 100n, ROOT_A).length, 2)
    const r = assignBuckets([a, b])
    assert.ok(r !== undefined)
    assert.equal(r.assignments.size, 16)
  })

  it('shouldApplyBalAtBlock filters lagging bucket pivots', () => {
    const pivots = Array.from({ length: 16 }, () => 100n)
    for (let b = 8; b < 16; b++) pivots[b] = 132n
    let addrLow = createAddressFromString('0x0000000000000000000000000000000000000001')
    let addrHigh = createAddressFromString('0x0000000000000000000000000000000000000002')
    for (let i = 0; i < 256; i++) {
      const probe = createAddressFromString(`0x${i.toString(16).padStart(40, '0')}`)
      if (bucketNibbleFromAddress(probe) === 0) addrLow = probe
      if (bucketNibbleFromAddress(probe) === 15) addrHigh = probe
    }
    const pred120 = shouldApplyBalAtBlock(pivots, 120n)
    assert.ok(pred120 !== undefined)
    assert.equal(pred120!(addrLow), true)
    assert.equal(pred120!(addrHigh), false)
    const pred140 = shouldApplyBalAtBlock(pivots, 140n)
    assert.equal(pred140, undefined)
  })

  it('preferCanonicalSnapOverEthy respects 2048 tail in auto', () => {
    assert.equal(
      preferCanonicalSnapOverEthy({
        syncMode: 'auto',
        explicitConnect: false,
        bestPeerHead: 3000n,
        freshestEthyPivotBlock: 500n,
        hasSnapPeer: true,
      }),
      true,
    )
    assert.equal(
      preferCanonicalSnapOverEthy({
        syncMode: 'auto',
        explicitConnect: false,
        bestPeerHead: 500n + DEFAULT_MAX_SWARM_TAIL_BLOCKS,
        freshestEthyPivotBlock: 500n,
        hasSnapPeer: true,
      }),
      false,
    )
    assert.equal(
      preferCanonicalSnapOverEthy({
        syncMode: 'ethy',
        explicitConnect: false,
        bestPeerHead: 9000n,
        freshestEthyPivotBlock: 100n,
        hasSnapPeer: true,
      }),
      false,
    )
  })

  it('bucketPivotMinMax detects uniform pivots', () => {
    const u = Array.from({ length: 16 }, () => 50n)
    assert.equal(bucketPivotMinMax(u).uniform, true)
    const m = [...u]
    m[15] = 80n
    assert.equal(bucketPivotMinMax(m).uniform, false)
  })

  it('peersOnSnapshot groups matching roots', () => {
    const list = [seeder('a', 10n, ROOT_A, 1, 20n), seeder('b', 10n, ROOT_A, 2, 20n)]
    assert.equal(peersOnSnapshot(list, 10n, ROOT_A).length, 2)
  })
})
