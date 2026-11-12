import { assert, describe, it } from 'vitest'

import { createFlatStateManager } from '@ethereumjs/statemanager'

import { DeterministicIntentEngine } from '../src/ai/deterministicEngine.ts'
import { advanceDemo } from '../src/demo/advanceDemo.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'

describe('[Ethy/Intent]: routing', () => {
  const engine = new DeterministicIntentEngine({ stateManager: createFlatStateManager() })

  it('short slash /p routes like /peers', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const r = await engine.handle({ text: '/p', spine })
    assert.equal(r.widget.kind, 'table')
  })

  it('/peers routes to peer table', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const r = await engine.handle({ text: '/peers', spine })
    assert.equal(r.widget.kind, 'table')
    assert.include(r.widget.kind === 'table' ? (r.widget.title ?? '') : '', 'Peer')
  })

  it('/ethy routes to ETHY overview', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const r = await engine.handle({ text: '/ethy', spine })
    assert.equal(r.widget.kind, 'table')
    assert.include(r.widget.kind === 'table' ? (r.widget.title ?? '') : '', 'ETHY')
  })

  it('keyword "stalled" routes to bucket table', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const r = await engine.handle({ text: 'why stalled', spine })
    assert.equal(r.widget.kind, 'table')
  })

  it('/drop removes peer from spine', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    assert.isTrue(spine.peers.has('a8f1'))
    await engine.handle({ text: '/drop a8f1', spine })
    assert.isFalse(spine.peers.has('a8f1'))
  })

  it('/range and /sample return account tables', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const range = await engine.handle({ text: '/range', spine })
    assert.equal(range.widget.kind, 'table')
    const sample = await engine.handle({ text: '/sample', spine })
    assert.equal(sample.widget.kind, 'table')
  })

  it('/pause and /resume toggle snapPaused', async () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    assert.isFalse(spine.snapPaused)
    await engine.handle({ text: '/pause', spine })
    assert.isTrue(spine.snapPaused)
    await engine.handle({ text: '/resume', spine })
    assert.isFalse(spine.snapPaused)
  })

  it('/reassign 0x3 resets bucket status', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    assert.equal(spine.snapBuckets[3]?.status, 'stalled')
    await engine.handle({ text: '/reassign 0x3', spine })
    assert.equal(spine.snapBuckets[3]?.status, 'pending')
  })
})

describe('[Ethy/Intent]: gating', () => {
  const engine = new DeterministicIntentEngine({ stateManager: createFlatStateManager() })

  it('/account while head locked returns key_value without throwing', async () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    const r = await engine.handle({ text: '/account 0xabc', spine })
    assert.equal(r.widget.kind, 'key_value')
    assert.include(r.widget.kind === 'key_value' ? (r.widget.title ?? '') : '', '/account')
  })

  it('/help opens unified command help while state locked', async () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'P2P_WARMUP')
    const r = await engine.handle({ text: '/help', spine })
    assert.equal(r.widget.kind, 'domain_help')
    if (r.widget.kind === 'domain_help') {
      assert.equal(r.widget.unified, true)
      const flat = r.widget.sections
        .flatMap((s) => s.rows?.map((row) => row.command) ?? [])
        .join(' ')
      assert.include(flat, '/economy')
      assert.include(flat, '/buckets')
      assert.include(flat, '/peers')
    }
    const stateHelp = await engine.handle({ text: '/help state', spine })
    if (stateHelp.widget.kind === 'domain_help') {
      const stateFlat = stateHelp.widget.sections
        .flatMap((s) => s.rows?.map((row) => row.command) ?? [])
        .join(' ')
      assert.include(stateFlat, '/account')
    }
  })
})
