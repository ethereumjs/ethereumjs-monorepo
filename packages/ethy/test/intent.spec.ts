import { assert, describe, it } from 'vitest'

import { DeterministicIntentEngine } from '../src/ai/deterministicEngine.ts'
import { advanceDemo } from '../src/demo/advanceDemo.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'

describe('[Ethy/Intent]: routing', () => {
  const engine = new DeterministicIntentEngine()

  it('short slash /p routes like /peers', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const r = engine.handle({ text: '/p', spine })
    assert.equal(r.widget.kind, 'table')
  })

  it('/peers routes to peer table', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const r = engine.handle({ text: '/peers', spine })
    assert.equal(r.widget.kind, 'table')
    assert.include(r.widget.kind === 'table' ? (r.widget.title ?? '') : '', 'Peer')
  })

  it('keyword "stalled" routes to bucket table', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const r = engine.handle({ text: 'why stalled', spine })
    assert.equal(r.widget.kind, 'table')
  })

  it('/drop removes peer from spine', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    assert.isTrue(spine.peers.has('a8f1'))
    engine.handle({ text: '/drop a8f1', spine })
    assert.isFalse(spine.peers.has('a8f1'))
  })

  it('/reassign 0x3 resets bucket status', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    assert.equal(spine.snapBuckets[3]?.status, 'stalled')
    engine.handle({ text: '/reassign 0x3', spine })
    assert.equal(spine.snapBuckets[3]?.status, 'pending')
  })
})

describe('[Ethy/Intent]: gating', () => {
  const engine = new DeterministicIntentEngine()

  it('/account while head locked returns key_value without throwing', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    const r = engine.handle({ text: '/account 0xabc', spine })
    assert.equal(r.widget.kind, 'key_value')
    assert.include(r.widget.kind === 'key_value' ? (r.widget.title ?? '') : '', 'locked')
  })

  it('/help omits head commands while head locked', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'P2P_WARMUP')
    const r = engine.handle({ text: '/help', spine })
    assert.equal(r.widget.kind, 'table')
    if (r.widget.kind === 'table') {
      const flat = r.widget.rows.flat().join(' ')
      assert.notInclude(flat, '/account')
    }
  })
})
