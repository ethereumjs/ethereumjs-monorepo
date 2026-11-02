/**
 * Manual 16-bucket snap scaling benchmark (~1–3 min). Not part of CI.
 *
 * Compares one vs two simulated snap peers (40ms RTT each). Exits 0 when
 * two peers finish at least 1.7× faster than one peer.
 *
 * Usage:
 *   npm run sync:bench --prefix packages/ethy
 */
import { createFlatStateManager } from '@ethereumjs/statemanager'

import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { SnapAccountSynchronizer } from '../src/sync/accountSync.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'

const LATENCY_MS = 40
const MIN_SPEEDUP = 1.7

function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildTransport(
  synthetic: SyntheticSnapPeer,
  peerIds: string[],
): SnapTransport {
  let onReply: ((peerId: string, payload: Uint8Array) => void) | undefined
  const schedulePeer = (id: string) => ({
    id,
    caps: ['snap/1'],
    snapResponsesOk: 2,
    snapTimeouts: 0,
    avgLatencyMs: LATENCY_MS,
  })
  return {
    snapPeers: () => peerIds.map(schedulePeer),
    sendAccountRange(peerId, payload) {
      void (async () => {
        await delayMs(LATENCY_MS)
        const reply = await synthetic.buildAccountRangeReply(payload)
        onReply?.(peerId, reply)
      })()
    },
    onAccountRange(cb) {
      onReply = cb
      return () => {
        onReply = undefined
      }
    },
    sendStorageRanges: () => {},
    onStorageRanges: () => () => {},
    sendByteCodes: () => {},
    onByteCodes: () => () => {},
  }
}

async function syncAllBuckets(peerCount: 1 | 2): Promise<number> {
  const synthetic = await SyntheticSnapPeer.create(4)
  const spine = createSpine('sepolia', 11155111n)
  spine.pivotStateRoot = synthetic.rootHash
  spine.snapBuckets = createSnapBuckets()
  const peerIds = Array.from({ length: peerCount }, (_, i) => `peer-${i}`)
  const sync = new SnapAccountSynchronizer({
    spine,
    stateManager: createFlatStateManager(),
    transport: buildTransport(synthetic, peerIds),
    flightTracker: new SnapPeerFlightTracker(),
    getSnapPeers: () =>
      peerIds.map((id) => ({
        id,
        caps: ['snap/1'],
        snapResponsesOk: 2,
        snapTimeouts: 0,
        avgLatencyMs: LATENCY_MS,
      })),
  })
  const t0 = performance.now()
  sync.start()
  while (spine.snapBuckets.some((b) => b.status !== 'done')) {
    await delayMs(25)
    if (performance.now() - t0 > 300_000) {
      sync.stop()
      throw new Error('sync-bench timeout after 300s')
    }
  }
  sync.stop()
  return performance.now() - t0
}

async function main(): Promise<void> {
  console.error('sync-bench: 16 buckets, 1 peer (40ms RTT)…')
  const onePeerMs = await syncAllBuckets(1)
  console.error(`sync-bench: 1 peer finished in ${onePeerMs.toFixed(0)} ms`)
  console.error('sync-bench: 16 buckets, 2 peers (40ms RTT each)…')
  const twoPeerMs = await syncAllBuckets(2)
  console.error(`sync-bench: 2 peers finished in ${twoPeerMs.toFixed(0)} ms`)
  const speedup = onePeerMs / twoPeerMs
  const pass = speedup >= MIN_SPEEDUP
  console.log(
    JSON.stringify(
      {
        latencyMs: LATENCY_MS,
        onePeerMs: Math.round(onePeerMs),
        twoPeerMs: Math.round(twoPeerMs),
        speedup: Number(speedup.toFixed(2)),
        minSpeedup: MIN_SPEEDUP,
        pass,
      },
      null,
      2,
    ),
  )
  process.exit(pass ? 0 : 1)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
