import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { FlatStateManager, createFlatStateManager } from '@ethereumjs/statemanager'
import * as util from '@ethereumjs/util'
import { accountToBinaryAccount, createAccount } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { encodeGetAccountRange } from '../src/sync/accountSync.ts'
import { decideSnapResume } from '../src/sync/resumePolicy.ts'
import { SNAP_VERIFY_POOL_MODULE_URL, SnapVerifyPool } from '../src/sync/snapVerifyWorker.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-perf-'))
}

function openStore(dir: string): SnapPivotStore {
  return SnapPivotStore.open({
    dataDir: dir,
    network: 'sepolia',
    chainId: 11155111n,
    genesisHash: networkGenesisHash('sepolia'),
    enabled: true,
  })
}

describe('[Ethy/Perf]: WP-04d invariants', () => {
  it('never calls binaryAccountToAccount during verify ingest or binary resume', async () => {
    const spy = vi.spyOn(util, 'binaryAccountToAccount')
    try {
      const peer = await SyntheticSnapPeer.create(2)
      const sm = createFlatStateManager()
      const pool = new SnapVerifyPool({ inProcess: true })
      for (const bucket of createSnapBuckets()) {
        const req = encodeGetAccountRange(
          1n,
          peer.rootHash,
          bucket.currentLastHash,
          bucket.limitHash,
          128 * 1024,
        )
        const reply = await peer.buildAccountRangeReply(req)
        const result = await pool.verifyAccountRange({
          stateRoot: peer.rootHash,
          origin: bucket.currentLastHash,
          payload: reply,
        })
        if (result.ok && result.slab !== undefined && result.count > 0) {
          sm.putSnapBinaryAccountsFromSlab(result.slab)
        }
      }

      const dir = tempDir()
      const store = openStore(dir)
      store.activatePivot({
        blockNumber: 100n,
        blockHash: new Uint8Array(32),
        stateRoot: peer.rootHash,
      })
      const hash = new Uint8Array(32)
      hash[0] = 0x01
      const binary = accountToBinaryAccount(createAccount({ nonce: 1n }))
      store.appendVerifiedRange(
        0,
        [{ accountHash: hash, binaryAccount: binary }],
        createSnapBuckets(),
      )
      await store.loadIntoAsync(createSpine('sepolia', 11155111n), createFlatStateManager())

      assert.equal(spy.mock.calls.length, 0)
    } finally {
      spy.mockRestore()
    }
  })

  it('FlatStateManager keeps empty delta stack and fast accountCount at scale', () => {
    const sm = new FlatStateManager()
    for (let i = 0; i < 10_000; i++) {
      const hash = new Uint8Array(32)
      hash[0] = i % 256
      hash[1] = (i >> 8) & 0xff
      sm.putSnapBinaryAccountsBatch([
        {
          accountHash: hash,
          binaryAccount: accountToBinaryAccount(createAccount({ nonce: BigInt(i) })),
        },
      ])
    }
    assert.equal(sm.accountCount(), 10_000)
    const t0 = performance.now()
    for (let i = 0; i < 1000; i++) {
      sm.accountCount()
    }
    assert.isBelow(performance.now() - t0, 5)
  })

  it('decideSnapResume reset-stale avoids journal hydrate', async () => {
    const dir = tempDir()
    const store = openStore(dir)
    const root = new Uint8Array(32)
    root[31] = 0x01
    store.activatePivot({ blockNumber: 1000n, blockHash: new Uint8Array(32), stateRoot: root })
    const loadSpy = vi.spyOn(store, 'loadIntoAsync')
    const saved = store.peekActive()
    assert.equal(decideSnapResume({ fresh: false, saved, head: 1200n }), 'reset-stale')
    store.discardPivots()
    assert.equal(loadSpy.mock.calls.length, 0)
    loadSpy.mockRestore()
  })

  it('decideSnapResume valid gap hydrates saved pivot buckets', async () => {
    const dir = tempDir()
    const store = openStore(dir)
    const root = new Uint8Array(32)
    root[31] = 0x02
    store.activatePivot({ blockNumber: 1000n, blockHash: new Uint8Array(32), stateRoot: root })
    const hash = new Uint8Array(32)
    hash[0] = 0x10
    const binary = accountToBinaryAccount(createAccount({ nonce: 1n }))
    const buckets = createSnapBuckets()
    buckets[0]!.status = 'done'
    store.appendVerifiedRange(0, [{ accountHash: hash, binaryAccount: binary }], buckets)
    assert.equal(
      decideSnapResume({ fresh: false, saved: store.peekActive(), head: 1050n }),
      'resume-snap',
    )
    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager()
    const restored = await store.loadIntoAsync(spine, sm)
    assert.equal(restored, 1)
    assert.equal(spine.pivotBlockNumber, 1000n)
    assert.equal(spine.snapBuckets[0]!.status, 'done')
    assert.notEqual(spine.snapBuckets[1]!.status, 'done')
  })

  it('SnapVerifyPool runs one account job out-of-process', async () => {
    const peer = await SyntheticSnapPeer.create(1)
    const bucket = createSnapBuckets()[0]!
    const req = encodeGetAccountRange(
      1n,
      peer.rootHash,
      bucket.currentLastHash,
      bucket.limitHash,
      128 * 1024,
    )
    const payload = await peer.buildAccountRangeReply(req)
    const pool = new SnapVerifyPool({
      inProcess: false,
      moduleUrl: SNAP_VERIFY_POOL_MODULE_URL,
    })
    try {
      const result = await pool.verifyAccountRange({
        stateRoot: peer.rootHash,
        payload,
      })
      assert.isTrue(result.ok)
      assert.isAtLeast(result.count, 1)
    } finally {
      await pool.close()
    }
  })
})
