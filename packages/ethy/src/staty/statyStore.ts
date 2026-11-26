import fs from 'node:fs'
import path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import { bytesToBigInt } from '@ethereumjs/util'

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
      Buffer.from([shardIndex, partIndex >> 8, partIndex & 0xff]),
      Buffer.from(body),
    ])
    fs.writeFileSync(path.join(dir, `${shardIndex}-${partIndex}.rlp`), file)
  }

  readManifest(epochNumber: bigint): StatyEpochManifestOnDisk | undefined {
    const file = path.join(this.epochsDir(), epochNumber.toString(), 'manifest.rlp')
    if (!fs.existsSync(file)) return undefined
    const raw = fs.readFileSync(file)
    if (raw.length < 4 || !raw.subarray(0, 4).equals(MANIFEST_MAGIC)) return undefined
    const decoded = RLP.decode(raw.subarray(4)) as unknown[]
    if (!Array.isArray(decoded) || decoded.length < 5) return undefined
    const shardsRaw = decoded[4] as unknown[]
    const shards = (Array.isArray(shardsRaw) ? shardsRaw : []).map((row) => {
      const r = row as unknown[]
      return {
        shardIndex: Number(r[0]),
        partCount: Number(r[1]),
        accountCount: Number(r[2]),
        slotCount: Number(r[3]),
        totalBytes: Number(r[4]),
      }
    })
    const epochV = decoded[0]
    const anchorV = decoded[1]
    const dedupV = decoded[3]
    return {
      epochNumber: typeof epochV === 'bigint' ? epochV : bytesToBigInt(epochV as Uint8Array),
      anchorBlock: typeof anchorV === 'bigint' ? anchorV : bytesToBigInt(anchorV as Uint8Array),
      anchorStateRoot: decoded[2] as Uint8Array,
      dedupBaseEpoch: typeof dedupV === 'bigint' ? dedupV : bytesToBigInt(dedupV as Uint8Array),
      shards,
    }
  }

  pruneEpochs(keepLatest: bigint): void {
    const root = this.epochsDir()
    if (!fs.existsSync(root)) return
    const min = keepLatest - BigInt(STATY_EPOCH_RETENTION)
    for (const name of fs.readdirSync(root)) {
      const e = BigInt(name)
      if (e < min) {
        fs.rmSync(path.join(root, name), { recursive: true, force: true })
      }
    }
  }
}
