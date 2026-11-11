import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { Worker } from 'node:worker_threads'

import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  bytesToHex,
  createBinaryAccount,
  setBinaryAccountCodeHash,
  setBinaryAccountStorageRoot,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3'
import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import {
  BINARY_ACCOUNT_JOURNAL_MAGIC,
  BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
} from '../src/persist/journal.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import type { IngestedAccountMeta } from '../src/sync/accountSync.ts'
import { SnapCodeAndStorageSynchronizer } from '../src/sync/codeAndStorageSync.ts'
import { shouldEnsureSnapSync } from '../src/sync/resumePolicy.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'
import { SnapVerifyPool } from '../src/sync/snapVerifyWorker.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-perf-'))
}

function fakeTransport(): SnapTransport {
  return {
    snapPeers: () => [],
    sendAccountRange: () => {},
    onAccountRange: () => () => {},
    sendStorageRanges: () => {},
    onStorageRanges: () => () => {},
    sendByteCodes: () => {},
    onByteCodes: () => () => {},
  }
}

function writeIndex32(buf: Uint8Array, i: number): void {
  buf[28] = (i >>> 24) & 0xff
  buf[29] = (i >>> 16) & 0xff
  buf[30] = (i >>> 8) & 0xff
  buf[31] = i & 0xff
}

function makeContractMeta(n: number): IngestedAccountMeta[] {
  const hashes = Array.from({ length: 256 }, (_, b) => keccak_256(new Uint8Array([b])))
  const out: IngestedAccountMeta[] = []
  for (let i = 0; i < n; i++) {
    const accountHash = new Uint8Array(32)
    writeIndex32(accountHash, i)
    const codeHash = new Uint8Array(hashes[i & 0xff]!)
    writeIndex32(codeHash, i)
    const storageRoot = new Uint8Array(hashes[(i + 1) & 0xff]!)
    writeIndex32(storageRoot, i + 1)
    out.push({ accountHash, codeHash, storageRoot })
  }
  return out
}

describe('[Ethy/Perf]: scale invariants', () => {
  it('noteAccounts ingests 20_000 contracts without a quadratic scan', () => {
    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager()
    const sync = new SnapCodeAndStorageSynchronizer({
      spine,
      stateManager: sm,
      transport: fakeTransport(),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => [],
      peerBusy: () => false,
      maxInMemoryContractTasks: 25_000,
    })
    const entries = makeContractMeta(20_000)
    const t0 = performance.now()
    sync.noteAccounts(entries)
    const elapsed = performance.now() - t0
    // Quadratic scans of 20k entries take seconds. Sub-second budgets still catch that case.
    // CI coverage (v8) adds overhead — observed ~270ms on GitHub runners (2026-11).
    assert.isBelow(elapsed, 400)
    assert.equal(spine.codesQueued, 20_000)
    sync.noteAccounts(entries)
    assert.equal(spine.codesQueued, 20_000)
  })

  it('loadIntoAsync tail resume keeps turns short and restores logical count', async () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0x01
    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    const rowCount = 100_000
    const body = new Uint8Array(
      BINARY_ACCOUNT_JOURNAL_MAGIC.length + rowCount * BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
    )
    body.set(BINARY_ACCOUNT_JOURNAL_MAGIC, 0)
    const codeHashes = Array.from({ length: 256 }, (_, b) => keccak_256(new Uint8Array([b])))
    const templateBinaries = Array.from({ length: 256 }, (_, b) => {
      const bin = createBinaryAccount({ nonce: 1n, balance: 1n })
      setBinaryAccountCodeHash(bin, codeHashes[b | 1]!)
      setBinaryAccountStorageRoot(bin, codeHashes[b]!)
      return bin
    })
    let offset = BINARY_ACCOUNT_JOURNAL_MAGIC.length
    for (let i = 0; i < rowCount; i++) {
      writeIndex32(body.subarray(offset, offset + 32), i)
      body.set(templateBinaries[i & 0xff]!, offset + 32)
      offset += BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
    }
    const stateRootHex = bytesToHex(root).slice(2).toLowerCase()
    const accountsDir = path.join(dir, 'networks', 'sepolia', 'pivots', stateRootHex, 'accounts')
    fs.mkdirSync(accountsDir, { recursive: true })
    fs.writeFileSync(path.join(accountsDir, '0.bin'), body)

    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager({ maxResidentAccounts: 512 })
    let maxTurnMs = 0
    let lastTurn = performance.now()
    let stopWatch = false
    const watch = (): void => {
      if (stopWatch) return
      const now = performance.now()
      maxTurnMs = Math.max(maxTurnMs, now - lastTurn)
      lastTurn = now
      setImmediate(watch)
    }
    setImmediate(watch)

    await store.loadIntoAsync(spine, sm)
    stopWatch = true
    assert.isBelow(maxTurnMs, 25)
    assert.equal(spine.totalAccountsSynced, rowCount)
    assert.equal(sm.accountCount(), rowCount)
    assert.isAtMost(sm.residentAccountCount(), 512)
  })

  it('SnapVerifyPool dispatches across worker slots', async () => {
    const posts: number[] = []
    let slot = 0
    const pool = new SnapVerifyPool({
      inProcess: false,
      poolSize: 2,
      createWorker: () => {
        const mySlot = slot++
        const worker = {
          postMessage: (msg: { id: number }) => {
            posts.push(mySlot)
            queueMicrotask(() => {
              worker._messageHandler?.({ id: msg.id, result: { ok: false, reason: 'stub' } })
            })
          },
          on: (event: string, handler: (msg: { id: number; result: { ok: boolean } }) => void) => {
            if (event === 'message') worker._messageHandler = handler
            return worker
          },
          terminate: async () => {},
          _messageHandler: undefined as
            | ((msg: { id: number; result: { ok: boolean; reason?: string } }) => void)
            | undefined,
        }
        return worker as unknown as Worker
      },
    })
    const payload = new Uint8Array([0x80])
    const root = new Uint8Array(32)
    await Promise.all([
      pool.verifyAccountRange({ stateRoot: root, payload: new Uint8Array(payload) }),
      pool.verifyAccountRange({ stateRoot: root, payload: new Uint8Array(payload) }),
      pool.verifyAccountRange({ stateRoot: root, payload: new Uint8Array(payload) }),
      pool.verifyAccountRange({ stateRoot: root, payload: new Uint8Array(payload) }),
    ])
    assert.equal(posts.length, 4)
    assert.include(posts, 0)
    assert.include(posts, 1)
    await pool.close()
  })

  it('shouldEnsureSnapSync waits for diskHydrated', () => {
    const root = new Uint8Array(32)
    assert.isFalse(
      shouldEnsureSnapSync({
        pivotStateRoot: root,
        diskHydrated: false,
        handoffCatchup: false,
      }),
    )
    assert.isTrue(
      shouldEnsureSnapSync({
        pivotStateRoot: root,
        diskHydrated: true,
        handoffCatchup: false,
      }),
    )
    assert.isFalse(
      shouldEnsureSnapSync({
        pivotStateRoot: root,
        diskHydrated: true,
        handoffCatchup: true,
      }),
    )
  })

  it('inProcess verify pool runs without workers', async () => {
    const pool = new SnapVerifyPool({ inProcess: true })
    const result = await pool.verifyAccountRange({
      stateRoot: new Uint8Array(32),
      payload: new Uint8Array([0x80, 0x80, 0x80, 0x80, 0xc0]),
    })
    assert.equal(result.ok, false)
    await pool.close()
  })
})
