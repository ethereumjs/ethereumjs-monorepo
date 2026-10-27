import { assert, describe, it } from 'vitest'

import { formatEthyStateHeader } from '../src/ai/stateHeader.ts'
import { resolveNetwork } from '../src/cli/chain.ts'
import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { DIAGNOSTIC_RING_CAPACITY, recordDiagnostic } from '../src/spine/diagnostics.ts'

describe('[Ethy/Spine]: buckets', () => {
  it('createSnapBuckets() yields 16 prefixes 0x0..0xf', () => {
    const buckets = createSnapBuckets()
    assert.equal(buckets.length, 16)
    assert.equal(buckets[0]?.prefix, '0x0')
    assert.equal(buckets[15]?.prefix, '0xf')
  })

  it('bucket 0x3 start hash uses nibble 0x30', () => {
    const b = createSnapBuckets()[3]
    assert.isDefined(b)
    assert.equal(b.startHash[0], 0x30)
    assert.equal(b.limitHash[0], 0x3f)
  })
})

describe('[Ethy/Spine]: diagnostics', () => {
  it('recordDiagnostic() drops oldest past capacity', () => {
    const spine = createSpine('sepolia', 11155111n)
    for (let i = 0; i < DIAGNOSTIC_RING_CAPACITY + 1; i++) {
      recordDiagnostic(spine, { subsystem: 'ai', severity: 'info', message: `m${i}` })
    }
    assert.equal(spine.diagnosticRingBuffer.length, DIAGNOSTIC_RING_CAPACITY)
    assert.equal(spine.diagnosticRingBuffer[0]?.message, 'm1')
  })
})

describe('[Ethy/Spine]: state header', () => {
  it('formatEthyStateHeader() uses first query slot_delta', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.currentSlot = 5
    const h = formatEthyStateHeader(spine, undefined)
    assert.include(h, 'slot_delta="first query"')
  })

  it('formatEthyStateHeader() computes +2 slot_delta', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.currentSlot = 7
    const h = formatEthyStateHeader(spine, 5)
    assert.include(h, 'slot_delta="+2 since last query"')
  })
})

describe('[Ethy/Spine]: chain', () => {
  it('resolveNetwork(sepolia) returns chain id 11155111', () => {
    const r = resolveNetwork('sepolia')
    assert.equal(r.chainId, 11155111n)
  })

  it('resolveNetwork(unknown) throws', () => {
    assert.throws(() => resolveNetwork('not-a-chain'), /Unknown network/)
  })
})
