import { EventEmitter } from 'eventemitter3'
import { assert, describe, it } from 'vitest'

import { createBlockchain } from '../src/index.ts'

// D-EVT-1: `events` is always defined at runtime on the Blockchain class (even though the
// `BlockchainInterface` type declares it optional for backwards compatibility).
describe('API conventions: Blockchain events always-defined (D-EVT-1)', () => {
  it('createBlockchain().events is always a defined EventEmitter', async () => {
    const blockchain = await createBlockchain()
    assert.instanceOf(blockchain.events, EventEmitter)
  })
})
