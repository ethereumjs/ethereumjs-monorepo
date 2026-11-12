import { assert, describe, it } from 'vitest'

import {
  CANONICAL_PIVOT_GRID_BLOCKS,
  nextCanonicalPivotBlock,
  selectCanonicalSnapPivotTarget,
} from '../src/sync/canonicalPivotGrid.ts'

describe('[Ethy/Sync]: canonical pivot grid', () => {
  it('selectCanonicalSnapPivotTarget snaps backward when remainder <= 24', () => {
    const head = 1000n
    const r = selectCanonicalSnapPivotTarget(head)
    assert.equal(r.waitBlocks, 0n)
    assert.equal(r.targetBlock, head - (head % CANONICAL_PIVOT_GRID_BLOCKS))
    const head24 = 1024n
    const r24 = selectCanonicalSnapPivotTarget(head24)
    assert.equal(r24.waitBlocks, 0n)
    assert.equal(r24.targetBlock, 1024n)
  })

  it('selectCanonicalSnapPivotTarget waits forward when remainder > 24', () => {
    const r25 = selectCanonicalSnapPivotTarget(1049n)
    assert.equal(r25.waitBlocks, 7n)
    assert.equal(r25.targetBlock, 1056n)
    const r31 = selectCanonicalSnapPivotTarget(1055n)
    assert.equal(r31.waitBlocks, 1n)
    assert.equal(r31.targetBlock, 1056n)
  })

  it('selectCanonicalSnapPivotTarget keeps tiny chains at head', () => {
    const r = selectCanonicalSnapPivotTarget(20n)
    assert.equal(r.targetBlock, 20n)
    assert.equal(r.waitBlocks, 0n)
  })

  it('nextCanonicalPivotBlock steps on-grid pivots by 32', () => {
    assert.equal(nextCanonicalPivotBlock(1024n, 1056n), 1056n)
    assert.equal(nextCanonicalPivotBlock(1024n, 1055n), undefined)
  })

  it('nextCanonicalPivotBlock aligns off-grid resume', () => {
    assert.equal(nextCanonicalPivotBlock(100n, 140n), 128n)
    assert.equal(nextCanonicalPivotBlock(128n, 160n), 160n)
  })
})
