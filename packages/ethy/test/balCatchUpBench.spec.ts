import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { performance } from 'node:perf_hooks'

import { Common, Mainnet } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  createBinaryAccount,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
  hashBlockAccessListRLP,
  setBinaryAccountBalance,
  setBinaryAccountNonce,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256, initEthyKeccak } from '../src/crypto/keccak.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import {
  appendBalTailBatch,
  appendBalTailBundle,
  enforceBalTailRetention,
  readBalTailBundle,
} from '../src/persist/balTailArchive.ts'
import { encodeHealBundleRlp } from '../src/persist/healBundle.ts'
import {
  BINARY_ACCOUNT_JOURNAL_MAGIC,
  BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
} from '../src/persist/journal.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { compareBytes32 } from '../src/spine/buckets.ts'

function makeAddress(id: number): Uint8Array {
  const out = new Uint8Array(20)
  out[16] = (id >>> 24) & 0xff
  out[17] = (id >>> 16) & 0xff
  out[18] = (id >>> 8) & 0xff
  out[19] = id & 0xff
  return out
}

function makeSlot32(id: number): Uint8Array {
  // Real Solidity mapping slots and values are full 32-byte hashes (non-zero high bytes).
  const out = new Uint8Array(32)
  out[0] = 0xa5 ^ (id & 0x7f)
  out[1] = 0x5a ^ ((id >>> 7) & 0xff)
  for (let i = 2; i < 28; i++) out[i] = ((id * 31 + i * 17) ^ 0x3c) & 0xff
  out[28] = (id >>> 24) & 0xff
  out[29] = (id >>> 16) & 0xff
  out[30] = (id >>> 8) & 0xff
  out[31] = id & 0xff
  return out
}

function minimalBigEndian(n: number): Uint8Array {
  if (n === 0) return new Uint8Array(0)
  const bytes: number[] = []
  let v = n
  while (v > 0) {
    bytes.push(v & 0xff)
    v >>>= 8
  }
  bytes.reverse()
  return new Uint8Array(bytes)
}

/**
 * Build a Sepolia-profile canonical RLP-encoded EIP-7928 BAL matching the
 * empirical average measured on 160 live Sepolia blocks (#12190208..#12190367):
 * ~360 accounts (~224 mutated, ~136 read-only), ~500 storage writes, ~760 reads, ~54 KB RLP.
 */
function buildSyntheticSepoliaBalRlp(
  blockIdx: number,
  opts: {
    mutatedAccounts?: number
    readOnlyAccounts?: number
    writesPerHotAccount?: number
    readsPerReadOnlyAccount?: number
  } = {},
): Uint8Array {
  const mutatedAccounts = opts.mutatedAccounts ?? 224
  const readOnlyAccounts = opts.readOnlyAccounts ?? 136
  const writesPerHotAccount = opts.writesPerHotAccount ?? 10
  const readsPerReadOnlyAccount = opts.readsPerReadOnlyAccount ?? 5

  // Accounts must be sorted lexicographically by 20-byte address for canonical EIP-7928 RLP.
  // Reuse 48 "hot" addresses across all blocks + block-varying addresses to reflect real ~3.9x batch dedupe.
  const ids: number[] = []
  for (let i = 1; i <= 48; i++) ids.push(i)
  const baseVarying = 1_000 + blockIdx * 50
  for (let i = 0; i < mutatedAccounts - 48; i++) ids.push(baseVarying + i)
  const baseReadOnly = 100_000 + blockIdx * 40
  for (let i = 0; i < readOnlyAccounts; i++) ids.push(baseReadOnly + i)
  ids.sort((a, b) => a - b)

  const txIdx = minimalBigEndian(1)
  const rows: unknown[] = []
  for (const id of ids) {
    const addr = makeAddress(id)
    const isReadOnly = id >= 100_000
    if (isReadOnly) {
      const reads: Uint8Array[] = []
      for (let r = 0; r < readsPerReadOnlyAccount; r++) {
        reads.push(makeSlot32(id * 16 + r))
      }
      rows.push([addr, [], reads, [], [], []])
      continue
    }
    const isHot = id <= 48
    const storageChanges: unknown[] = []
    if (isHot) {
      for (let s = 0; s < writesPerHotAccount; s++) {
        storageChanges.push([makeSlot32(s + 1), [[txIdx, makeSlot32(blockIdx * 1000 + id + s)]]])
      }
    }
    const balanceChanges = [[txIdx, minimalBigEndian(10_000_000 + blockIdx * 17 + id)]]
    const nonceChanges = [[txIdx, minimalBigEndian(blockIdx + 1)]]
    rows.push([addr, storageChanges, [], balanceChanges, nonceChanges, []])
  }
  return createBlockLevelAccessListFromRLP(RLP.encode(rows as never)).serialize()
}

function keyTop48(buf: Uint8Array, off = 0): number {
  return (
    buf[off]! * 2 ** 40 +
    buf[off + 1]! * 2 ** 32 +
    buf[off + 2]! * 2 ** 24 +
    buf[off + 3]! * 2 ** 16 +
    buf[off + 4]! * 2 ** 8 +
    buf[off + 5]!
  )
}

function writeSortedJournal(filePath: string, hashes: Uint8Array[]): void {
  const sorted = [...hashes].sort(compareBytes32)
  const rowSize = BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
  const buf = Buffer.alloc(BINARY_ACCOUNT_JOURNAL_MAGIC.length + sorted.length * rowSize)
  buf.set(BINARY_ACCOUNT_JOURNAL_MAGIC, 0)
  for (let i = 0; i < sorted.length; i++) {
    const off = BINARY_ACCOUNT_JOURNAL_MAGIC.length + i * rowSize
    buf.set(sorted[i]!, off)
    const bin = createBinaryAccount()
    setBinaryAccountNonce(bin, BigInt(i + 1))
    setBinaryAccountBalance(bin, BigInt(i + 1) * 1000n)
    buf.set(bin, off + 32)
  }
  fs.writeFileSync(filePath, buf)
}

describe('[Ethy/Bench]: BAL catch-up stage baseline (WP-14)', () => {
  it('verifies direct wire keccak256 matches BlockLevelAccessList.hash() and benchmarks decode/apply/disk stages', async () => {
    await initEthyKeccak()

    const batchSize = 32
    const balRlpList = Array.from({ length: batchSize }, (_, i) => buildSyntheticSepoliaBalRlp(i))
    const avgBytes = balRlpList.reduce((sum, b) => sum + b.length, 0) / batchSize
    assert.isAbove(avgBytes, 30_000, 'synthetic Sepolia BALs should be multi-tens-of-KB')

    // 1. Current materializeBalBatch path: createBlockLevelAccessListFromRLP + bal.hash() + bal.toJSON()
    let tCreate = 0
    let tHashObj = 0
    let tToJson = 0
    let tDirectWasmHash = 0
    const balJsonList = []
    for (const rlp of balRlpList) {
      let t0 = performance.now()
      const wireHash = ethyKeccak256(rlp)
      tDirectWasmHash += performance.now() - t0

      t0 = performance.now()
      const bal = createBlockLevelAccessListFromRLP(rlp)
      tCreate += performance.now() - t0

      t0 = performance.now()
      const objHash = bal.hash()
      tHashObj += performance.now() - t0

      assert.isTrue(
        equalsBytes(wireHash, objHash),
        'direct keccak256(balRlp) must equal BlockLevelAccessList.hash() for canonical EIP-7928 RLP',
      )

      t0 = performance.now()
      balJsonList.push(bal.toJSON())
      tToJson += performance.now() - t0
    }

    // 2. State apply via FlatStateManager.consumeBALBatch (RAM-only)
    const common = new Common({
      chain: Mainnet,
      customCrypto: { keccak256: ethyKeccak256 },
    })
    const sm = createFlatStateManager({ common })
    const tConsume0 = performance.now()
    await sm.consumeBALBatch(balJsonList)
    const tConsumeJSONMs = performance.now() - tConsume0

    const smRlp = createFlatStateManager({ common })
    const tConsumeRlp0 = performance.now()
    await smRlp.consumeBALBatch(balRlpList)
    const tConsumeRlpMs = performance.now() - tConsumeRlp0
    const tWireHash0 = performance.now()
    for (const rlp of balRlpList) {
      hashBlockAccessListRLP(rlp, ethyKeccak256)
    }
    const tWireHashMs = performance.now() - tWireHash0
    const legacyMaterializeMs = tCreate + tHashObj + tToJson + tConsumeJSONMs
    const optimizedPipelineMs = tWireHashMs + tConsumeRlpMs
    assert.isAbove(
      legacyMaterializeMs / Math.max(optimizedPipelineMs, 0.001),
      3,
      'wire hash + RLP consumeBALBatch should beat create/hash/toJSON/JSON batch by >=3x',
    )
    assert.isAbove(
      tHashObj / Math.max(tWireHashMs, 0.001),
      2,
      'wire hash should beat re-encode hash by >=2x',
    )

    // 3. Per-block disk persistence (current appendHealBundle + appendBalTailBundle) vs batched segment write
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-bal-bench-'))
    const headerRlp = new Uint8Array(680)
    try {
      const p1 = path.join(tmpRoot, 'per-block')
      fs.mkdirSync(p1, { recursive: true })
      fs.writeFileSync(path.join(p1, 'pivot.json'), JSON.stringify({ blockNumber: '100' }))
      const healDir = path.join(p1, 'heal')
      const tDiskPerBlock0 = performance.now()
      for (let i = 0; i < batchSize; i++) {
        const blockNumber = BigInt(101 + i)
        fs.mkdirSync(healDir, { recursive: true })
        const body = encodeHealBundleRlp({
          blockNumber,
          blockHash: new Uint8Array(32),
          stateRoot: new Uint8Array(32),
          headerRlp,
          balRlp: balRlpList[i]!,
        })
        fs.writeFileSync(path.join(healDir, `${blockNumber.toString()}.bundle.rlp`), body)
        appendBalTailBundle(p1, blockNumber, headerRlp, balRlpList[i]!)
        JSON.parse(fs.readFileSync(path.join(p1, 'pivot.json'), 'utf8'))
        enforceBalTailRetention(p1, { minEarliest: 101n })
      }
      const tDiskPerBlockMs = performance.now() - tDiskPerBlock0

      const p2 = path.join(tmpRoot, 'batched')
      fs.mkdirSync(path.join(p2, 'bal-tail'), { recursive: true })
      const tDiskBatch0 = performance.now()
      const hdrBuf = Buffer.alloc(4 + 256 * 12, 0)
      const chunks: Buffer[] = [hdrBuf]
      let off = hdrBuf.length
      for (let i = 0; i < batchSize; i++) {
        hdrBuf.writeUInt32BE(off, 4 + i * 12)
        hdrBuf.writeUInt32BE(headerRlp.length, 4 + i * 12 + 4)
        hdrBuf.writeUInt32BE(balRlpList[i]!.length, 4 + i * 12 + 8)
        chunks.push(Buffer.from(headerRlp), Buffer.from(balRlpList[i]!))
        off += headerRlp.length + balRlpList[i]!.length
      }
      fs.writeFileSync(path.join(p2, 'bal-tail', 'seg-0.bin'), Buffer.concat(chunks))
      fs.writeFileSync(path.join(p2, 'bal-tail', 'manifest.bin.tmp'), Buffer.alloc(28))
      fs.renameSync(
        path.join(p2, 'bal-tail', 'manifest.bin.tmp'),
        path.join(p2, 'bal-tail', 'manifest.bin'),
      )
      const tDiskBatchMs = performance.now() - tDiskBatch0

      const p3 = path.join(tmpRoot, 'batch-api')
      fs.mkdirSync(path.join(p3, 'bal-tail'), { recursive: true })
      const tApiBatch0 = performance.now()
      appendBalTailBatch(
        p3,
        balRlpList.map((balRlp, i) => ({
          blockNumber: BigInt(101 + i),
          headerRlp,
          balRlp,
        })),
      )
      const tApiBatchMs = performance.now() - tApiBatch0
      assert.isAbove(
        tDiskPerBlockMs / Math.max(tApiBatchMs, 0.001),
        3,
        'appendBalTailBatch API should beat per-block heal writes by >=3x',
      )
      assert.isDefined(readBalTailBundle(p3, 101n))

      assert.isBelow(
        tDirectWasmHash,
        tHashObj,
        'direct wire keccak256 must beat BlockLevelAccessList.hash() re-serialization',
      )
      assert.isBelow(
        tDiskBatchMs,
        tDiskPerBlockMs,
        'single batched segment write must beat 32 per-block file/manifest writes',
      )

      if (process.env.ETHY_BENCH === '1') {
        console.log(
          [
            `[WP-14 bench] 32-blk synthetic Sepolia batch (avg ${(avgBytes / 1024).toFixed(1)} KB/blk):`,
            `  createBAL=${tCreate.toFixed(1)}ms | bal.hash()=${tHashObj.toFixed(1)}ms (direct WASM=${tDirectWasmHash.toFixed(1)}ms) | toJSON=${tToJson.toFixed(1)}ms`,
            `  consumeBALBatch(JSON)=${tConsumeJSONMs.toFixed(1)}ms | consumeBALBatch(RLP)=${tConsumeRlpMs.toFixed(1)}ms`,
            `  disk(per-block)=${tDiskPerBlockMs.toFixed(1)}ms vs disk(batched)=${tDiskBatchMs.toFixed(1)}ms`,
          ].join('\n'),
        )
      }
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true })
    }
  })

  it('proves Keccak-256 interpolation search matches binary search with fewer disk reads', async () => {
    await initEthyKeccak()
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-interpolation-bench-'))
    try {
      const store = SnapPivotStore.open({
        dataDir: tmpDir,
        network: 'sepolia',
        chainId: 11155111n,
        genesisHash: networkGenesisHash('sepolia'),
        enabled: true,
      })
      const stateRootHex = 'aa'.repeat(32)
      const pivotDir = path.join(tmpDir, 'networks', 'sepolia', 'pivots', stateRootHex)
      const accDir = path.join(pivotDir, 'accounts')
      fs.mkdirSync(accDir, { recursive: true })
      fs.writeFileSync(
        path.join(tmpDir, 'networks', 'sepolia', 'active.json'),
        JSON.stringify({ stateRoot: stateRootHex, baseSyncComplete: true }),
      )

      // Generate 8,192 uniform Keccak-256 hashes inside bucket 0x0 (first nibble = 0)
      const bucketHashes: Uint8Array[] = []
      for (let i = 0; bucketHashes.length < 8192; i++) {
        const h = ethyKeccak256(makeSlot32(i + 1))
        if (h[0]! >> 4 === 0) bucketHashes.push(h)
      }
      const journalPath = path.join(accDir, '0.bin')
      writeSortedJournal(journalPath, bucketHashes)

      // Query 256 present + 256 absent hashes in bucket 0x0
      const queries: Array<{ hash: Uint8Array; expectedHit: boolean }> = []
      for (let i = 0; i < 256; i++) {
        queries.push({ hash: bucketHashes[i * 31]!, expectedHit: true })
      }
      for (let i = 500_000; queries.length < 512; i++) {
        const h = ethyKeccak256(makeSlot32(i))
        if (h[0]! >> 4 === 0) queries.push({ hash: h, expectedHit: false })
      }

      // Baseline SnapPivotStore.lookupBinaryAccountByHash + true async batch lookup
      let baselineHits = 0
      const tCur0 = performance.now()
      for (const q of queries) {
        if (store.lookupBinaryAccountByHash(q.hash) !== undefined) baselineHits++
      }
      const tCurMs = performance.now() - tCur0

      const asyncMap = await store.lookupBinaryAccountsBatchAsync(queries.map((q) => q.hash))
      let asyncHits = 0
      for (const q of queries) {
        const hit = asyncMap.get(Buffer.from(q.hash).toString('hex'))
        assert.strictEqual(hit !== undefined, q.expectedHit)
        if (hit !== undefined) asyncHits++
      }
      assert.strictEqual(asyncHits, 256)

      // Interpolation search with 64-row tail window read
      const fd = fs.openSync(journalPath, 'r')
      const magicLen = BINARY_ACCOUNT_JOURNAL_MAGIC.length
      const rowSize = BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
      const count = Math.floor((fs.fstatSync(fd).size - magicLen) / rowSize)
      const minKey = Buffer.alloc(32)
      const maxKey = Buffer.alloc(32)
      fs.readSync(fd, minKey, 0, 32, magicLen)
      fs.readSync(fd, maxKey, 0, 32, magicLen + (count - 1) * rowSize)
      const min48 = keyTop48(minKey)
      const max48 = keyTop48(maxKey)
      const scratch = Buffer.alloc(rowSize)
      const windowBuf = Buffer.alloc(rowSize * 64)

      let interpolatedHits = 0
      let interpolatedReads = 0
      const tInt0 = performance.now()
      for (const q of queries) {
        const h = q.hash
        let found = false
        if (compareBytes32(h, minKey) >= 0 && compareBytes32(h, maxKey) <= 0) {
          let lo = 0
          let hi = count - 1
          let lo48 = min48
          let hi48 = max48
          const target48 = keyTop48(h)
          let steps = 0
          while (lo <= hi) {
            if (hi - lo < 64) {
              const n = hi - lo + 1
              fs.readSync(fd, windowBuf, 0, n * rowSize, magicLen + lo * rowSize)
              interpolatedReads++
              let wlo = 0
              let whi = n - 1
              while (wlo <= whi) {
                const wm = (wlo + whi) >>> 1
                const cmp = compareBytes32(windowBuf.subarray(wm * rowSize, wm * rowSize + 32), h)
                if (cmp === 0) {
                  found = true
                  break
                }
                if (cmp < 0) wlo = wm + 1
                else whi = wm - 1
              }
              break
            }
            let mid: number
            if (hi48 > lo48 && steps < 6) {
              const frac = (target48 - lo48) / (hi48 - lo48)
              mid = lo + Math.floor(Math.max(0, Math.min(1, frac)) * (hi - lo))
              if (mid === lo) mid = lo + 1
              else if (mid === hi) mid = hi - 1
            } else {
              mid = (lo + hi) >>> 1
            }
            steps++
            fs.readSync(fd, scratch, 0, rowSize, magicLen + mid * rowSize)
            interpolatedReads++
            const cmp = compareBytes32(scratch.subarray(0, 32), h)
            if (cmp === 0) {
              found = true
              break
            }
            const mid48 = keyTop48(scratch)
            if (cmp < 0) {
              lo = mid + 1
              lo48 = mid48
            } else {
              hi = mid - 1
              hi48 = mid48
            }
          }
        }
        assert.strictEqual(found, q.expectedHit)
        if (found) interpolatedHits++
      }
      const tIntMs = performance.now() - tInt0
      fs.closeSync(fd)

      assert.strictEqual(interpolatedHits, baselineHits)
      assert.strictEqual(interpolatedHits, 256)
      const avgReads = interpolatedReads / queries.length
      assert.isBelow(
        avgReads,
        4.0,
        'interpolation search + 64-row tail read should average < 4 reads on 8,192 uniform hashes',
      )

      if (process.env.ETHY_BENCH === '1') {
        console.log(
          `[WP-14 bench] 512 lookups (8,192 rows): current=${tCurMs.toFixed(1)}ms vs interpolation=${tIntMs.toFixed(1)}ms (avg ${avgReads.toFixed(2)} reads/lookup)`,
        )
      }
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})
