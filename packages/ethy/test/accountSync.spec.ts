import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it } from 'vitest'

import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { encodeGetAccountRange } from '../src/sync/accountSync.ts'
import {
  SyntheticSnapPeer,
  incrementKey32,
  ingestAccountRangeReply,
} from '../src/sync/syntheticPeer.ts'

describe('[Ethy/Sync]: synthetic snap account range', () => {
  it('syncs all 16 buckets with one proof retry on 0x3', async () => {
    const t0 = performance.now()
    const peer = await SyntheticSnapPeer.create(10)
    const sm = createFlatStateManager()
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotStateRoot = peer.rootHash
    spine.snapBuckets = createSnapBuckets()
    let proofFailures = 0
    for (const bucket of spine.snapBuckets) {
      let done = false
      while (!done) {
        const req = encodeGetAccountRange(
          1n,
          peer.rootHash,
          bucket.currentLastHash,
          bucket.limitHash,
          512 * 1024,
        )
        const reply = await peer.buildAccountRangeReply(req)
        const result = await ingestAccountRangeReply(peer.rootHash, reply, (entries) =>
          sm.putSnapAccountsBatch(entries),
        )
        if (!result.ok) {
          proofFailures++
          continue
        }
        spine.totalAccountsSynced += result.count
        const accountsRaw = (RLP.decode(reply) as unknown[])[1] as Array<[Uint8Array, Uint8Array]>
        if (result.count === 0) {
          done = true
        } else if (!result.hasRight) {
          done = true
        } else {
          bucket.currentLastHash = incrementKey32(accountsRaw[accountsRaw.length - 1]![0]!)
        }
      }
      bucket.status = 'done'
    }
    assert.isAtLeast(proofFailures, 1)
    assert.strictEqual(sm.accountCount(), 160)
    assert.isBelow(performance.now() - t0, 150)
  })
})
