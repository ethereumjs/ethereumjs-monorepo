import { RLP } from '@ethereumjs/rlp'
import { assert, describe, it } from 'vitest'

import { buildSnapRlpPayload } from '../../src/lab/messages/snap.ts'

describe('snap lab messages', () => {
  it('buildSnapRlpPayload() GET_ACCOUNT_RANGE uses flat 5-tuple', () => {
    const root = `0x${'aa'.repeat(32)}`
    const start = `0x${'00'.repeat(32)}`
    const limit = `0x${'ff'.repeat(32)}`
    const input = buildSnapRlpPayload('GET_ACCOUNT_RANGE', {
      requestId: 0,
      rootHash: root,
      startingHash: start,
      limitHash: limit,
      responseBytes: 0,
    })
    const decoded = RLP.decode(RLP.encode(input)) as unknown[]
    assert.strictEqual(decoded.length, 5)
    assert.strictEqual((decoded[0] as Uint8Array).length, 0)
    assert.strictEqual((decoded[4] as Uint8Array).length, 0)
  })
})
