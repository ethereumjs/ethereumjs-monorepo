import { deriveCapabilities, setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'

const SYNTH_PIVOT = 7_812_400n
const SYNTH_HEAD = 7_812_550n

function synthRoot(seed: number): Uint8Array {
  const h = new Uint8Array(32)
  h[0] = seed
  h[31] = 0xaa
  return h
}

/** Deterministic offline progression for `--demo` (stalled bucket always 0x3). */
export function advanceDemo(spine: EthySpine, elapsedMs: number): void {
  spine.currentSlot = Math.floor(elapsedMs / 1000)

  if (elapsedMs < 1000) {
    setPhase(spine, 'BOOTING')
    spine.peers.clear()
    for (const b of spine.snapBuckets) {
      b.status = 'pending'
      b.accountsLoaded = 0
      b.lastStallReason = undefined
      b.assignedPeerId = undefined
    }
    spine.totalAccountsSynced = 0
    spine.accountsPerSec = 0
    deriveCapabilities(spine)
    return
  }

  if (elapsedMs < 4000) {
    setPhase(spine, 'P2P_WARMUP')
    spine.peers.clear()
    spine.peers.set('a8f1', {
      id: 'a8f1',
      clientName: 'Reth/v1.2.0',
      caps: ['eth/71', 'snap/1'],
      snapRequestsSent: 0,
      snapResponsesOk: 0,
      snapTimeouts: 0,
      avgLatencyMs: elapsedMs >= 2500 ? 84 : 420,
    })
    spine.peers.set('c31e', {
      id: 'c31e',
      clientName: 'Geth/v1.15.0',
      caps: ['eth/71', 'snap/1'],
      snapRequestsSent: 12,
      snapResponsesOk: 12,
      snapTimeouts: 0,
      avgLatencyMs: 84,
    })
    spine.peers.set('9b02', {
      id: '9b02',
      clientName: 'Nethermind/v1.30.0',
      caps: ['eth/70', 'snap/1'],
      snapRequestsSent: 4,
      snapResponsesOk: 4,
      snapTimeouts: 0,
      avgLatencyMs: 112,
    })
    deriveCapabilities(spine)
    return
  }

  if (elapsedMs < 8000) {
    setPhase(spine, 'SNAP_SYNCING')
    if (spine.peers.size === 0) {
      spine.peers.set('a8f1', {
        id: 'a8f1',
        clientName: 'Reth/v1.2.0',
        caps: ['eth/71', 'snap/1'],
        snapRequestsSent: 8,
        snapResponsesOk: 4,
        snapTimeouts: 2,
        avgLatencyMs: 1420,
      })
      spine.peers.set('c31e', {
        id: 'c31e',
        clientName: 'Geth/v1.15.0',
        caps: ['eth/71', 'snap/1'],
        snapRequestsSent: 12,
        snapResponsesOk: 12,
        snapTimeouts: 0,
        avgLatencyMs: 84,
      })
      spine.peers.set('9b02', {
        id: '9b02',
        clientName: 'Nethermind/v1.30.0',
        caps: ['eth/70', 'snap/1'],
        snapRequestsSent: 4,
        snapResponsesOk: 4,
        snapTimeouts: 0,
        avgLatencyMs: 112,
      })
    }
    for (let i = 0; i < 16; i++) {
      const b = spine.snapBuckets[i]
      if (i <= 2) {
        b.status = 'done'
        b.accountsLoaded = 14_200
      } else if (i === 3) {
        b.status = 'stalled'
        b.accountsLoaded = 800
        b.assignedPeerId = 'a8f1'
        b.lastStallReason = 'Timeout on GetAccountRange'
      } else if (i === 4) {
        b.status = 'syncing'
        b.accountsLoaded = 3_100
        b.assignedPeerId = 'c31e'
      } else {
        b.status = 'pending'
        b.accountsLoaded = 0
      }
    }
    if (!spine.diagnosticRingBuffer.some((e) => e.bucketIndex === 3)) {
      recordDiagnostic(spine, {
        subsystem: 'snap',
        severity: 'warn',
        peerId: 'a8f1',
        bucketIndex: 3,
        message: 'Timeout on GetAccountRange',
      })
    }
    spine.totalAccountsSynced = 84_200
    spine.accountsPerSec = 4210
    deriveCapabilities(spine)
    return
  }

  setPhase(spine, 'HEAD_FOLLOWING')
  for (const b of spine.snapBuckets) {
    b.status = 'done'
    b.accountsLoaded = 14_200
  }
  spine.pivotBlockNumber = SYNTH_PIVOT
  spine.pivotStateRoot = synthRoot(0x01)
  spine.headBlockNumber = SYNTH_HEAD
  spine.headStateRoot = synthRoot(0x02)
  spine.totalAccountsSynced = 227_200
  spine.accountsPerSec = 0
  deriveCapabilities(spine)
}
