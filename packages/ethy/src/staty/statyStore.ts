import fs from 'node:fs'
import path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import { bytesToBigInt, bytesToUnprefixedHex } from '@ethereumjs/util'

import { STATY_EPOCH_RETENTION } from './constants.ts'
import type { StatyMultiProofGroup } from './multiProofVerify.ts'

export type StatyEpochManifestOnDisk = {
  epochNumber: bigint
  anchorBlock: bigint
  anchorStateRoot: Uint8Array
  dedupBaseEpoch: bigint
  shards: Array<{
    shardIndex: number
    partCount: number
    accountCount: number
    slotCount: number
    totalBytes: number
  }>
}

const MANIFEST_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x4d])
const PART_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x50])
const WITNESS_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x58])

function rlpToBigInt(v: unknown): bigint {
  if (typeof v === 'bigint') return v
  if (typeof v === 'number') return BigInt(v)
  if (v instanceof Uint8Array) return v.length === 0 ? 0n : bytesToBigInt(v)
  return 0n
}

function rlpToInt(v: unknown): number {
  const big = rlpToBigInt(v)
  return big > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : Number(big)
}

export class EthyStatyStore {
  private readonly _statyDir: string

  constructor(statyDir: string) {
    this._statyDir = statyDir
  }

  epochsDir(): string {
    return path.join(this._statyDir, 'epochs')
  }

  witnessesDir(): string {
    return path.join(this._statyDir, 'witnesses')
  }

  writeManifest(manifest: StatyEpochManifestOnDisk): void {
    const dir = path.join(this.epochsDir(), manifest.epochNumber.toString())
    fs.mkdirSync(dir, { recursive: true })
    const shardRows = manifest.shards.map((s) => [
      s.shardIndex,
      s.partCount,
      s.accountCount,
      s.slotCount,
      s.totalBytes,
    ])
    const body = RLP.encode([
      manifest.epochNumber,
      manifest.anchorBlock,
      manifest.anchorStateRoot,
      manifest.dedupBaseEpoch,
      shardRows,
    ] as unknown as Uint8Array[])
    const tmp = path.join(dir, 'manifest.rlp.tmp')
    const out = path.join(dir, 'manifest.rlp')
    const file = Buffer.concat([MANIFEST_MAGIC, Buffer.from(body)])
    fs.writeFileSync(tmp, file)
    fs.renameSync(tmp, out)
  }

  writeEpochPart(
    epochNumber: bigint,
    shardIndex: number,
    partIndex: number,
    group: StatyMultiProofGroup,
  ): void {
    const dir = path.join(this.epochsDir(), epochNumber.toString())
    fs.mkdirSync(dir, { recursive: true })
    const accounts = group.accounts.map((a) => [a.accountHash, a.accountRlpOrEmpty])
    const slots = group.slots.map((s) => [s.accountHash, s.slotHash, s.slotValOrEmpty])
    const body = RLP.encode([
      epochNumber,
      shardIndex,
      partIndex,
      group.anchorStateRoot,
      accounts,
      slots,
      group.proofNodes,
    ] as unknown as Uint8Array[])
    const file = Buffer.concat([
      PART_MAGIC,
      Buffer.from([shardIndex, (partIndex >> 8) & 0xff, partIndex & 0xff]),
      Buffer.from(body),
    ])
    const out = path.join(dir, `${shardIndex}-${partIndex}.rlp`)
    const tmp = `${out}.tmp`
    fs.writeFileSync(tmp, file)
    fs.renameSync(tmp, out)
  }

  writeWitness(accountHash: Uint8Array, anchorBlock: bigint, group: StatyMultiProofGroup): void {
    const dir = this.witnessesDir()
    fs.mkdirSync(dir, { recursive: true })
    const hex = bytesToUnprefixedHex(accountHash)
    const body = RLP.encode([
      anchorBlock,
      group.anchorStateRoot,
      group.accounts.map((a) => [a.accountHash, a.accountRlpOrEmpty]),
      group.slots.map((s) => [s.accountHash, s.slotHash, s.slotValOrEmpty]),
      group.proofNodes,
    ] as unknown as Uint8Array[])
    const out = path.join(dir, `${hex}.rlp`)
    const tmp = `${out}.tmp`
    fs.writeFileSync(tmp, Buffer.concat([WITNESS_MAGIC, Buffer.from(body)]))
    fs.renameSync(tmp, out)
  }

  readManifest(epochNumber: bigint): StatyEpochManifestOnDisk | undefined {
    const file = path.join(this.epochsDir(), epochNumber.toString(), 'manifest.rlp')
    if (!fs.existsSync(file)) return undefined
    const raw = fs.readFileSync(file)
    if (raw.length < 4 || !raw.subarray(0, 4).equals(MANIFEST_MAGIC)) return undefined
    const decoded = RLP.decode(raw.subarray(4)) as unknown[]
    if (!Array.isArray(decoded) || decoded.length < 5) return undefined
    const shardsRaw = decoded[4] as unknown[]
    const shards = (Array.isArray(shardsRaw) ? shardsRaw : [])
      .filter((row): row is unknown[] => Array.isArray(row) && row.length >= 5)
      .map((r) => ({
        shardIndex: rlpToInt(r[0]),
        partCount: rlpToInt(r[1]),
        accountCount: rlpToInt(r[2]),
        slotCount: rlpToInt(r[3]),
        totalBytes: rlpToInt(r[4]),
      }))
    const anchorStateRoot = decoded[2]
    if (!(anchorStateRoot instanceof Uint8Array) || anchorStateRoot.length !== 32) return undefined
    return {
      epochNumber: rlpToBigInt(decoded[0]),
      anchorBlock: rlpToBigInt(decoded[1]),
      anchorStateRoot,
      dedupBaseEpoch: rlpToBigInt(decoded[3]),
      shards,
    }
  }

  pruneEpochs(keepLatest: bigint): void {
    const root = this.epochsDir()
    if (!fs.existsSync(root)) return
    const min = keepLatest - BigInt(STATY_EPOCH_RETENTION)
    for (const name of fs.readdirSync(root)) {
      if (!/^\d+$/.test(name)) continue
      const e = BigInt(name)
      if (e < min) {
        fs.rmSync(path.join(root, name), { recursive: true, force: true })
      }
    }
  }

  pruneWitnesses(minAnchorBlock: bigint, maxBudgetBytes = 512 * 1024 * 1024): void {
    const dir = this.witnessesDir()
    if (!fs.existsSync(dir)) return
    const entries: Array<{ file: string; mtimeMs: number; size: number }> = []
    let totalBytes = 0
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.rlp')) continue
      const full = path.join(dir, name)
      try {
        const raw = fs.readFileSync(full)
        if (raw.length < 4 || !raw.subarray(0, 4).equals(WITNESS_MAGIC)) {
          fs.rmSync(full, { force: true })
          continue
        }
        const decoded = RLP.decode(raw.subarray(4)) as unknown[]
        const anchorBlock = Array.isArray(decoded) ? rlpToBigInt(decoded[0]) : 0n
        if (anchorBlock < minAnchorBlock) {
          fs.rmSync(full, { force: true })
          continue
        }
        const stat = fs.statSync(full)
        totalBytes += stat.size
        entries.push({ file: full, mtimeMs: stat.mtimeMs, size: stat.size })
      } catch {
        fs.rmSync(full, { force: true })
      }
    }
    if (totalBytes <= maxBudgetBytes) return
    entries.sort((a, b) => a.mtimeMs - b.mtimeMs)
    for (const ent of entries) {
      if (totalBytes <= maxBudgetBytes) break
      fs.rmSync(ent.file, { force: true })
      totalBytes -= ent.size
    }
  }
}
