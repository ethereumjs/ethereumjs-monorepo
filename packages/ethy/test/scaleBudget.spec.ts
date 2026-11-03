import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import v8 from 'node:v8'

import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  bytesToHex,
  createBinaryAccount,
  setBinaryAccountCodeHash,
  setBinaryAccountStorageRoot,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3'
import { assert, afterEach, describe, it, vi } from 'vitest'

import { ResourceBudgetWatchdog } from '../src/runtime/resourceBudget.ts'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import {
  BINARY_ACCOUNT_JOURNAL_MAGIC,
  BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
} from '../src/persist/journal.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { SnapCodeAndStorageSynchronizer } from '../src/sync/codeAndStorageSync.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'
import { ingestedMetaFromBinarySlab } from '../src/sync/syntheticPeer.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-scale-'))
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

describe('[Ethy/Scale]: WP-04g budget gates', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('ingested meta does not pin the worker slab buffer', () => {
    const slab = new Uint8Array(BINARY_ACCOUNT_JOURNAL_RECORD_SIZE)
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0x01
    slab.set(accountHash, 0)
    const binary = createBinaryAccount({ nonce: 1n, balance: 1n })
    setBinaryAccountCodeHash(binary, keccak_256(new Uint8Array([1])))
    setBinaryAccountStorageRoot(binary, keccak_256(new Uint8Array([2])))
    slab.set(binary, 32)
    const meta = ingestedMetaFromBinarySlab(slab)
    assert.equal(meta.length, 1)
    assert.notEqual(meta[0]!.accountHash.buffer, slab.buffer)
    assert.equal(meta[0]!.accountHash.byteLength, 32)
    assert.notEqual(meta[0]!.codeHash.buffer, slab.buffer)
    assert.notEqual(meta[0]!.storageRoot.buffer, slab.buffer)
  })

  it('bounded resident set and contract spill plateau heap growth', { timeout: 5_000 }, () => {
    const dir = tempDir()
    const spill = path.join(dir, 'contracts-spill.bin')
    let coldLookups = 0
    const sm = createFlatStateManager({
      maxResidentAccounts: 10_000,
      coldAccountLookup: () => {
        coldLookups++
        return undefined
      },
    })
    const spine = createSpine('sepolia', 11155111n)
    const sync = new SnapCodeAndStorageSynchronizer({
      spine,
      stateManager: sm,
      transport: fakeTransport(),
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => [],
      peerBusy: () => false,
      maxInMemoryContractTasks: 2_000,
      contractSpillPath: spill,
    })
    const gc = (globalThis as { gc?: () => void }).gc
    let heapAt50k = process.memoryUsage().heapUsed
    const totalAccounts = 80_000
    const contractAccounts = 12_000
    const codeHashes = Array.from({ length: 256 }, (_, b) => keccak_256(new Uint8Array([b])))
    const eoaBinary = createBinaryAccount({ nonce: 1n, balance: 1n })
    const contractBinaries = Array.from({ length: 256 }, (_, b) => {
      const bin = createBinaryAccount({ nonce: 1n, balance: 1n })
      setBinaryAccountCodeHash(bin, codeHashes[b]!)
      setBinaryAccountStorageRoot(bin, codeHashes[(b + 1) & 0xff]!)
      return bin
    })
    const batchSize = 1_000
    const slab = new Uint8Array(batchSize * BINARY_ACCOUNT_JOURNAL_RECORD_SIZE)
    const t0 = performance.now()
    for (let batchStart = 0; batchStart < totalAccounts; batchStart += batchSize) {
      const contractEntries: Array<{
        accountHash: Uint8Array
        codeHash: Uint8Array
        storageRoot: Uint8Array
      }> = []
      for (let j = 0; j < batchSize; j++) {
        const i = batchStart + j
        const rowOff = j * BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
        slab.fill(0, rowOff, rowOff + 32)
        writeIndex32(slab.subarray(rowOff, rowOff + 32), i)
        const isContract = i < contractAccounts
        const bin = isContract ? contractBinaries[i & 0xff]! : eoaBinary
        slab.set(bin, rowOff + 32)
        if (isContract) {
          const accountHash = new Uint8Array(32)
          writeIndex32(accountHash, i)
          contractEntries.push({
            accountHash,
            codeHash: codeHashes[i & 0xff]!,
            storageRoot: codeHashes[(i + 1) & 0xff]!,
          })
        }
      }
      sm.putSnapBinaryAccountsFromSlab(slab)
      if (contractEntries.length > 0) {
        sync.noteAccounts(contractEntries)
      }
      if (batchStart + batchSize === 40_000) {
        gc?.()
        heapAt50k = process.memoryUsage().heapUsed
      }
    }
    const elapsedMs = performance.now() - t0
    gc?.()
    const heapAt200k = process.memoryUsage().heapUsed
    assert.equal(coldLookups, 0)
    assert.isBelow(elapsedMs, 2_000)
    assert.equal(sm.accountCount(), totalAccounts)
    assert.isAtMost(sm.residentAccountCount(), 10_000)
    assert.isAtMost(spine.codesQueued, 2_000)
    assert.isAbove(sync.contractsBacklogSize(), 0)
    assert.isAtMost(heapAt200k - heapAt50k, 12 * 1024 * 1024)
  })

  it('tail-seek loadIntoAsync and cold lookup', async () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0x02
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
    const rowCount = 50_000
    const body = new Uint8Array(
      BINARY_ACCOUNT_JOURNAL_MAGIC.length + rowCount * BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
    )
    body.set(BINARY_ACCOUNT_JOURNAL_MAGIC, 0)
    let offset = BINARY_ACCOUNT_JOURNAL_MAGIC.length
    for (let i = 0; i < rowCount; i++) {
      const accountHash = new Uint8Array(32)
      writeIndex32(accountHash, i)
      body.set(accountHash, offset)
      const binary = createBinaryAccount({ nonce: 1n, balance: 1n })
      body.set(binary, offset + 32)
      offset += BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
    }
    const stateRootHex = bytesToHex(root).slice(2).toLowerCase()
    const accountsDir = path.join(dir, 'networks', 'sepolia', 'pivots', stateRootHex, 'accounts')
    fs.mkdirSync(accountsDir, { recursive: true })
    fs.writeFileSync(path.join(accountsDir, '0.bin'), body)

    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager({
      maxResidentAccounts: 10_000,
      coldAccountLookup: (h) => store.lookupBinaryAccountByHash(h),
    })
    const t0 = performance.now()
    await store.loadIntoAsync(spine, sm)
    const elapsed = performance.now() - t0
    // Full 50k replay takes seconds; tail warmup should stay sub-second on CI (coverage adds overhead).
    assert.isBelow(elapsed, 200)
    assert.equal(spine.totalAccountsSynced, rowCount)
    const hash0 = new Uint8Array(32)
    writeIndex32(hash0, 0)
    const hashMid = new Uint8Array(32)
    writeIndex32(hashMid, 12_345)
    const hashLast = new Uint8Array(32)
    writeIndex32(hashLast, rowCount - 1)
    assert.isDefined(sm.getAccountByHash(hash0))
    assert.isDefined(sm.getAccountByHash(hashMid))
    assert.isDefined(sm.getAccountByHash(hashLast))
  })

  it('resource watchdog trims unpinned residents under heap pressure', () => {
    vi.useFakeTimers()
    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager({ maxResidentAccounts: 1000 })
    for (let i = 0; i < 800; i++) {
      const accountHash = new Uint8Array(32)
      writeIndex32(accountHash, i)
      sm.putSnapBinaryAccountsBatch([
        { accountHash, binaryAccount: createBinaryAccount({ nonce: 1n, balance: 1n }) },
      ])
    }
    assert.isAbove(sm.residentAccountCount(), 250)
    vi.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 0,
      heapTotal: 0,
      heapUsed: 700,
      external: 0,
      arrayBuffers: 0,
    })
    vi.spyOn(v8, 'getHeapStatistics').mockReturnValue({
      ...v8.getHeapStatistics(),
      heap_size_limit: 1000,
    })
    const wd = new ResourceBudgetWatchdog({
      spine,
      stateManager: sm,
      maxResidentAccounts: 1000,
    })
    wd.start()
    wd.start()
    vi.advanceTimersByTime(2000)
    wd.stop()
    assert.isAtMost(sm.residentAccountCount(), 250)
  })
})
