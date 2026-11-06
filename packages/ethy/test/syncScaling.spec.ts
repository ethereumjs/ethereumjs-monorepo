import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createFlatStateManager } from '@ethereumjs/statemanager'
import { accountToBinaryAccount, createAccount } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { isBinaryAccountJournalFile } from '../src/persist/journal.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'

function openStore(dir: string): SnapPivotStore {
  return SnapPivotStore.open({
    dataDir: dir,
    network: 'sepolia',
    chainId: 11155111n,
    genesisHash: networkGenesisHash('sepolia'),
    enabled: true,
  })
}
import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { SnapAccountSynchronizer } from '../src/sync/accountSync.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import {
  MAX_IN_FLIGHT_FAST_PROVEN,
  MAX_IN_FLIGHT_PROBE,
  MAX_IN_FLIGHT_PROVEN,
  PROVEN_RANGE_TIMEOUT_MS,
  RESPONSE_BYTES_FAST,
  RESPONSE_BYTES_PROBE,
  RESPONSE_BYTES_STANDARD,
  UNPROVEN_RANGE_TIMEOUT_MS,
  maxInFlightForPeer,
  rangeTimeoutForPeer,
  rankSnapPeers,
  responseBytesForPeer,
} from '../src/sync/snapSchedulePolicy.ts'

const provenPeer = {
  id: 'fast',
  caps: ['snap/1'],
  snapResponsesOk: 2,
  snapTimeouts: 0,
  avgLatencyMs: 40,
}

const unprovenPeer = {
  id: 'zombie',
  caps: ['snap/1'],
  snapResponsesOk: 0,
  snapTimeouts: 0,
  avgLatencyMs: 40,
}

describe('[Ethy/Sync]: snap schedule policy (WP-04c, WP-06e)', () => {
  it('uses probe tier for unproven and high-latency peers', () => {
    assert.equal(maxInFlightForPeer(unprovenPeer), MAX_IN_FLIGHT_PROBE)
    assert.equal(responseBytesForPeer(unprovenPeer), RESPONSE_BYTES_PROBE)
    assert.equal(maxInFlightForPeer({ ...provenPeer, avgLatencyMs: 450 }), MAX_IN_FLIGHT_PROBE)
    assert.equal(maxInFlightForPeer({ ...provenPeer, snapResponsesOk: 1 }), MAX_IN_FLIGHT_PROBE)
    assert.equal(maxInFlightForPeer({ ...provenPeer, snapTimeouts: 1 }), MAX_IN_FLIGHT_PROBE)
  })

  it('uses standard tier for proven peers with clean timeout ratio', () => {
    assert.equal(maxInFlightForPeer(provenPeer), MAX_IN_FLIGHT_PROVEN)
    assert.equal(responseBytesForPeer(provenPeer), RESPONSE_BYTES_STANDARD)
  })

  it('uses fast tier for six clean low-latency responses or proven Nethermind', () => {
    const fast = { ...provenPeer, snapResponsesOk: 6, snapTimeouts: 0, avgLatencyMs: 200 }
    assert.equal(maxInFlightForPeer(fast), MAX_IN_FLIGHT_FAST_PROVEN)
    assert.equal(responseBytesForPeer(fast), RESPONSE_BYTES_FAST)
    const nm = {
      ...provenPeer,
      clientFamily: 'Nethermind',
      snapResponsesOk: 2,
      avgLatencyMs: 300,
    }
    assert.equal(maxInFlightForPeer(nm), MAX_IN_FLIGHT_FAST_PROVEN)
    assert.equal(responseBytesForPeer(nm), RESPONSE_BYTES_FAST)
  })

  it('ranks proven peers by clean timeouts, client affinity, then latency', () => {
    const slow = { ...provenPeer, id: 'slow', avgLatencyMs: 90, clientFamily: 'Geth' }
    const fast = { ...provenPeer, id: 'fast', avgLatencyMs: 20, clientFamily: 'Geth' }
    const nm = { ...provenPeer, id: 'nm', avgLatencyMs: 50, clientFamily: 'Nethermind' }
    const dirty = { ...provenPeer, id: 'dirty', snapTimeouts: 1 }
    const unknownRtt = { ...provenPeer, id: 'unknown', avgLatencyMs: 0 }
    const ranked = rankSnapPeers([unprovenPeer, slow, fast, unknownRtt, dirty, nm])
    assert.deepEqual(
      ranked.map((p) => p.id),
      ['nm', 'fast', 'slow', 'unknown', 'dirty', 'zombie'],
    )
  })

  it('uses a 4s range timeout for unproven peers and 8s for proven peers', () => {
    assert.equal(rangeTimeoutForPeer(unprovenPeer), UNPROVEN_RANGE_TIMEOUT_MS)
    assert.equal(rangeTimeoutForPeer(provenPeer), PROVEN_RANGE_TIMEOUT_MS)
  })

  it('tracks two concurrent flights per proven peer by reqId', () => {
    const tracker = new SnapPeerFlightTracker()
    assert.isTrue(tracker.tryClaim('p', { kind: 'account', reqId: 1n, sentAt: 0 }, 2))
    assert.isTrue(tracker.tryClaim('p', { kind: 'account', reqId: 2n, sentAt: 0 }, 2))
    assert.isFalse(tracker.tryClaim('p', { kind: 'account', reqId: 3n, sentAt: 0 }, 2))
    tracker.release('p', 1n)
    assert.isTrue(tracker.tryClaim('p', { kind: 'account', reqId: 3n, sentAt: 0 }, 2))
  })
})

describe('[Ethy/Sync]: binary journal (WP-04c)', () => {
  it('loadInto restores binary journal rows into getBinaryAccountByHash', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-wp04c-'))
    const root = new Uint8Array(32)
    root[31] = 0x42
    const store = openStore(dir)
    store.activatePivot({ blockNumber: 10n, blockHash: new Uint8Array(32), stateRoot: root })
    const hash = new Uint8Array(32)
    hash[0] = 0x02
    const binary = accountToBinaryAccount(createAccount({ nonce: 3n, balance: 4n }))
    store.appendVerifiedRange(
      0,
      [{ accountHash: hash, binaryAccount: binary }],
      createSnapBuckets(),
    )
    const rootHex = Array.from(root, (b) => b.toString(16).padStart(2, '0')).join('')
    const journalPath = path.join(
      dir,
      'networks',
      'sepolia',
      'pivots',
      rootHex,
      'accounts',
      '0.bin',
    )
    assert.isTrue(isBinaryAccountJournalFile(new Uint8Array(fs.readFileSync(journalPath))))
    const sm = createFlatStateManager()
    openStore(dir).loadInto(createSpine('sepolia', 11155111n), sm)
    const stored = sm.getBinaryAccountByHash(hash)
    assert.isDefined(stored)
    assert.equal(stored!.length, 104)
  })
})

describe('[Ethy/Sync]: multi-peer scaling (fast smoke)', () => {
  it('times out a silent unproven peer at 4s and returns the bucket to pending', async () => {
    vi.useFakeTimers()
    try {
      const spine = createSpine('sepolia', 11155111n)
      spine.pivotStateRoot = new Uint8Array(32)
      spine.snapBuckets = createSnapBuckets().slice(0, 1)
      const sync = new SnapAccountSynchronizer({
        spine,
        stateManager: createFlatStateManager(),
        transport: {
          snapPeers: () => [unprovenPeer],
          sendAccountRange: () => {},
          onAccountRange: () => () => {},
          sendStorageRanges: () => {},
          onStorageRanges: () => () => {},
          sendByteCodes: () => {},
          onByteCodes: () => () => {},
        },
        flightTracker: new SnapPeerFlightTracker(),
        getSnapPeers: () => [unprovenPeer],
      })
      sync.start()
      assert.equal(spine.snapBuckets[0]!.status, 'syncing')
      await vi.advanceTimersByTimeAsync(UNPROVEN_RANGE_TIMEOUT_MS + 100)
      assert.equal(spine.snapBuckets[0]!.status, 'pending')
      sync.stop()
    } finally {
      vi.useRealTimers()
    }
  })
})
