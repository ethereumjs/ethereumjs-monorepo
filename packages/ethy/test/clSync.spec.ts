import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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

  it('notePeerHeader resolves Amsterdam ePBS block numbers when hash matches CL head/finalized', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.clOptimisticSlot = 11_505_600
    spine.clFinalizedSlot = 11_505_536
    spine.clHeadBlockHash = new Uint8Array(32).fill(0x11)
    spine.clFinalizedBlockHash = new Uint8Array(32).fill(0x22)
    spine.clParticipationPct = 99.6

    witnessPeerExecutionHeader(spine, 12_062_100n, new Uint8Array(32).fill(0x22))
    assert.equal(spine.clFinalizedBlockNumber, 12_062_100n)

    witnessPeerExecutionHeader(spine, 12_062_164n, new Uint8Array(32).fill(0x11))
    assert.equal(spine.clOptimisticBlockNumber, 12_062_164n)
    assert.equal(spine.clStatus, 'verified')
  })

  it('unreachable beacon REST leaves p2p_only without throwing', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const dataDir = mkdtempSync(join(tmpdir(), 'ethy-cl-offline-'))
    const handle = startConsensusTracker({
      spine,
      network: 'sepolia',
      dataDir,
      fetchImpl: async () => {
        throw new Error('offline')
      },
    })
    const deadline = Date.now() + 3000
    while (spine.clStatus !== 'p2p_only' && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 25))
    }
    assert.equal(spine.clStatus, 'p2p_only')
    handle.stop()
  })
})
