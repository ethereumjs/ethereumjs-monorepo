import * as fs from 'node:fs'
import * as path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

import { MAX_STATY_PROOF_NODES } from '../protocol/staty/codec.ts'

export type StatyEpochShardRow = {
  shardIndex: number
  partCount: number
  accountCount: number
  slotCount: number
  totalBytes: number
}

export type StatyEpochManifest = {
  epochNumber: bigint
  anchorBlock: bigint
  anchorStateRoot: Uint8Array
  dedupBaseEpoch: bigint
  shards: StatyEpochShardRow[]
}

export type StatyEpochPart = {
  epochNumber: bigint
  shardIndex: number
  partIndex: number
  anchorBlock: bigint
  anchorStateRoot: Uint8Array
  accounts: Array<{ accountHash: Uint8Array; accountRlpOrEmpty: Uint8Array }>
  slots: Array<{ accountHash: Uint8Array; slotHash: Uint8Array; slotValOrEmpty: Uint8Array }>
  proofNodes: Uint8Array[]
}

export type StatyWitnessRecord = {
  accountHash: Uint8Array
  anchorBlock: bigint
  anchorStateRoot: Uint8Array
  accountRlpOrEmpty: Uint8Array
  slots: Array<{ slotHash: Uint8Array; slotValOrEmpty: Uint8Array }>
  proofNodes: Uint8Array[]
}

export type StatyWitnessQuery = {
  accountHash: Uint8Array
  slotHashes: Uint8Array[]
}

const partKey = (epoch: bigint, shard: number, part: number): string => `${epoch}:${shard}:${part}`

const MANIFEST_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x4d])
const PART_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x50])

function scalarBigInt(v: unknown): bigint {
  if (v instanceof Uint8Array) {
    if (v.length === 0) return 0n
    let n = 0n
    for (const b of v) n = (n << 8n) + BigInt(b)
    return n
  }
  if (typeof v === 'number') return BigInt(v)
  if (typeof v === 'bigint') return v
  return 0n
}

function parseManifestFile(raw: Buffer): StatyEpochManifest | undefined {
  if (raw.length < 4 || !raw.subarray(0, 4).equals(MANIFEST_MAGIC)) return undefined
  const decoded = RLP.decode(raw.subarray(4)) as unknown[]
  if (!Array.isArray(decoded) || decoded.length < 5) return undefined
  const shardsRaw = decoded[4] as unknown[]
  const shards: StatyEpochShardRow[] = []
  if (Array.isArray(shardsRaw)) {
    for (const row of shardsRaw) {
      const r = row as unknown[]
      shards.push({
        shardIndex: Number(r[0]),
        partCount: Number(r[1]),
        accountCount: Number(r[2]),
        slotCount: Number(r[3]),
        totalBytes: Number(r[4]),
      })
    }
  }
  return {
    epochNumber: scalarBigInt(decoded[0]),
    anchorBlock: scalarBigInt(decoded[1]),
    anchorStateRoot: decoded[2] as Uint8Array,
    dedupBaseEpoch: scalarBigInt(decoded[3]),
    shards,
  }
}

function parseEpochPartFile(raw: Buffer): StatyEpochPart | undefined {
  if (raw.length < 7 || !raw.subarray(0, 4).equals(PART_MAGIC)) return undefined
  const bodyOff = 7
  const decoded = RLP.decode(raw.subarray(bodyOff)) as unknown[]
  if (!Array.isArray(decoded) || decoded.length < 7) return undefined
  const accountsRaw = decoded[4] as unknown[]
  const slotsRaw = decoded[5] as unknown[]
  const proofRaw = decoded[6] as unknown[]
  const accounts: StatyEpochPart['accounts'] = []
  if (Array.isArray(accountsRaw)) {
    for (const row of accountsRaw) {
      const r = row as unknown[]
      accounts.push({ accountHash: r[0] as Uint8Array, accountRlpOrEmpty: r[1] as Uint8Array })
    }
  }
  const slots: StatyEpochPart['slots'] = []
  if (Array.isArray(slotsRaw)) {
    for (const row of slotsRaw) {
      const r = row as unknown[]
      slots.push({
        accountHash: r[0] as Uint8Array,
        slotHash: r[1] as Uint8Array,
        slotValOrEmpty: r[2] as Uint8Array,
      })
    }
  }
  const proofNodes = Array.isArray(proofRaw)
    ? proofRaw.filter((n): n is Uint8Array => n instanceof Uint8Array)
    : []
  return {
    epochNumber: scalarBigInt(decoded[0]),
    shardIndex: Number(decoded[1]),
    partIndex: Number(decoded[2]),
    anchorBlock: scalarBigInt(decoded[0]) * 256n,
    anchorStateRoot: decoded[3] as Uint8Array,
    accounts,
    slots,
    proofNodes,
  }
}

export class StatyStore {
  private readonly _manifests = new Map<string, StatyEpochManifest>()
  private readonly _parts = new Map<string, StatyEpochPart>()
  private readonly _witnesses = new Map<string, StatyWitnessRecord[]>()
  private _dataDir: string | undefined

  setDataDir(dir: string | undefined): void {
    this._dataDir = dir
  }

  putManifest(manifest: StatyEpochManifest): void {
    this._manifests.set(manifest.epochNumber.toString(), manifest)
  }

  putEpochPart(part: StatyEpochPart): void {
    this._parts.set(partKey(part.epochNumber, part.shardIndex, part.partIndex), part)
  }

  putWitness(record: StatyWitnessRecord): void {
    const key = bytesToUnprefixedHex(record.accountHash)
    const list = this._witnesses.get(key) ?? []
    list.push(record)
    this._witnesses.set(key, list)
  }

  manifestForEpoch(epochNumber: bigint): StatyEpochManifest | undefined {
    const hit = this._manifests.get(epochNumber.toString())
    if (hit !== undefined) return hit
    if (this._dataDir === undefined) return undefined
    const file = path.join(this._dataDir, 'epochs', epochNumber.toString(), 'manifest.rlp')
    try {
      if (!fs.existsSync(file)) return undefined
      const parsed = parseManifestFile(fs.readFileSync(file))
      if (parsed !== undefined) {
        this._manifests.set(epochNumber.toString(), parsed)
      }
      return parsed
    } catch {
      return undefined
    }
  }

  partFor(epochNumber: bigint, shardIndex: number, partIndex: number): StatyEpochPart | undefined {
    const hit = this._parts.get(partKey(epochNumber, shardIndex, partIndex))
    if (hit !== undefined) return hit
    if (this._dataDir === undefined) return undefined
    const file = path.join(
      this._dataDir,
      'epochs',
      epochNumber.toString(),
      `${shardIndex}-${partIndex}.rlp`,
    )
    try {
      if (!fs.existsSync(file)) return undefined
      const parsed = parseEpochPartFile(fs.readFileSync(file))
      if (parsed !== undefined) {
        this._parts.set(partKey(epochNumber, shardIndex, partIndex), parsed)
      }
      return parsed
    } catch {
      return undefined
    }
  }

  resolveWitnesses(
    minAnchorBlock: bigint,
    maxBytes: number,
    queries: readonly StatyWitnessQuery[],
  ): Array<{
    anchorBlock: bigint
    anchorStateRoot: Uint8Array
    accounts: Array<{ accountHash: Uint8Array; accountRlpOrEmpty: Uint8Array }>
    slots: Array<{ accountHash: Uint8Array; slotHash: Uint8Array; slotValOrEmpty: Uint8Array }>
    proofNodes: Uint8Array[]
  }> {
    const groups = new Map<
      string,
      {
        anchorBlock: bigint
        anchorStateRoot: Uint8Array
        accounts: Array<{ accountHash: Uint8Array; accountRlpOrEmpty: Uint8Array }>
        slots: Array<{ accountHash: Uint8Array; slotHash: Uint8Array; slotValOrEmpty: Uint8Array }>
        proofNodes: Uint8Array[]
        proofKeys: Set<string>
      }
    >()
    let budget = maxBytes
    let totalSlots = 0
    let totalProofNodes = 0
    const accountQueries = queries.slice(0, 64)

    for (const q of accountQueries) {
      if (q.accountHash.length !== 32) continue
      const records = this._witnesses.get(bytesToUnprefixedHex(q.accountHash)) ?? []
      const best = records
        .filter((r) => r.anchorBlock >= minAnchorBlock)
        .sort((a, b) =>
          b.anchorBlock > a.anchorBlock ? 1 : b.anchorBlock < a.anchorBlock ? -1 : 0,
        )[0]
      if (best === undefined) continue

      const gKey = `${best.anchorBlock}:${bytesToUnprefixedHex(best.anchorStateRoot)}`
      let group = groups.get(gKey)
      const existingKeys = group?.proofKeys
      const newProofs: Uint8Array[] = []
      let newProofBytes = 0
      for (const node of best.proofNodes) {
        const nk = bytesToUnprefixedHex(node)
        if (existingKeys?.has(nk) === true) continue
        if (newProofs.some((p) => bytesToUnprefixedHex(p) === nk)) continue
        newProofs.push(node)
        newProofBytes += node.length
      }

      const acctHex = bytesToUnprefixedHex(q.accountHash)
      const needAccount =
        group === undefined ||
        !group.accounts.some((a) => bytesToUnprefixedHex(a.accountHash) === acctHex)
      const accountCost = needAccount ? best.accountRlpOrEmpty.length + 64 : 0
      if (budget < accountCost + newProofBytes) continue
      if (totalProofNodes + newProofs.length > MAX_STATY_PROOF_NODES) continue

      if (group === undefined) {
        group = {
          anchorBlock: best.anchorBlock,
          anchorStateRoot: best.anchorStateRoot,
          accounts: [],
          slots: [],
          proofNodes: [],
          proofKeys: new Set<string>(),
        }
        groups.set(gKey, group)
      }
      for (const node of newProofs) {
        const nk = bytesToUnprefixedHex(node)
        group.proofKeys.add(nk)
        group.proofNodes.push(node)
      }
      totalProofNodes += newProofs.length
      budget -= newProofBytes

      if (needAccount) {
        group.accounts.push({
          accountHash: q.accountHash,
          accountRlpOrEmpty: best.accountRlpOrEmpty,
        })
        budget -= accountCost
      }
      for (const slotHash of q.slotHashes) {
        if (totalSlots >= 256) break
        if (slotHash.length !== 32) continue
        const slot = best.slots.find(
          (s) => bytesToUnprefixedHex(s.slotHash) === bytesToUnprefixedHex(slotHash),
        )
        if (slot === undefined) continue
        const est = 64 + slot.slotValOrEmpty.length
        if (budget < est) continue
        group.slots.push({
          accountHash: q.accountHash,
          slotHash,
          slotValOrEmpty: slot.slotValOrEmpty,
        })
        totalSlots++
        budget -= est
      }
    }

    return [...groups.values()].map(({ proofKeys: _ignored, ...rest }) => rest)
  }
}
