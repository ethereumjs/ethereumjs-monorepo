import { assert, describe, it } from 'vitest'

import { startConsensusTracker, witnessPeerExecutionHeader } from '../src/cl/consensusTracker.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('[Ethy]: consensus light client witness', () => {
  it('notePeerHeader flags hash mismatch at the same height', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.clOptimisticBlockNumber = 100n
    spine.clHeadBlockHash = new Uint8Array(32)
    spine.clHeadBlockHash[0] = 0xaa
    const peerHash = new Uint8Array(32)
    peerHash[0] = 0xbb
    witnessPeerExecutionHeader(spine, 100n, peerHash)
    assert.equal(spine.clStatus, 'mismatch')
  })

  it('unreachable beacon REST leaves p2p_only without throwing', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const handle = startConsensusTracker({
      spine,
      network: 'sepolia',
      fetchImpl: async () => {
        throw new Error('offline')
      },
    })
    await new Promise((r) => setTimeout(r, 50))
    assert.equal(spine.clStatus, 'p2p_only')
    handle.stop()
  })
})
