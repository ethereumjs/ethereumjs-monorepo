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
  MAX_IN_FLIGHT_PROVEN,
  UNPROVEN_RANGE_TIMEOUT_MS,
  maxInFlightForPeer,
  rangeTimeoutForPeer,
  rankSnapPeers,
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

describe('[Ethy/Sync]: snap schedule policy (WP-04c)', () => {
  it('allows two in-flight account ranges for proven peers only', () => {
    assert.equal(maxInFlightForPeer(provenPeer), MAX_IN_FLIGHT_PROVEN)
    assert.equal(maxInFlightForPeer({ ...provenPeer, snapResponsesOk: 1 }), 1)
    assert.equal(maxInFlightForPeer({ ...provenPeer, snapTimeouts: 1 }), 1)
    assert.equal(maxInFlightForPeer(unprovenPeer), 1)
  })

  it('ranks proven peers by latency before unproven peers', () => {
    const slow = { ...provenPeer, id: 'slow', avgLatencyMs: 90 }
    const fast = { ...provenPeer, id: 'fast', avgLatencyMs: 20 }
    const unknownRtt = { ...provenPeer, id: 'unknown', avgLatencyMs: 0 }
    const ranked = rankSnapPeers([unprovenPeer, slow, fast, unknownRtt])
    assert.deepEqual(
      ranked.map((p) => p.id),
      ['fast', 'slow', 'unknown', 'zombie'],
    )
  })

  it('allows four in-flight ranges for fast proven peers', () => {
    const fast = { ...provenPeer, snapResponsesOk: 4, snapTimeouts: 0 }
    assert.equal(maxInFlightForPeer(fast), 4)
  })

  it('uses a 4s range timeout for unproven peers', () => {
    assert.equal(rangeTimeoutForPeer(unprovenPeer), UNPROVEN_RANGE_TIMEOUT_MS)
    assert.equal(rangeTimeoutForPeer(provenPeer), 20_000)
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
