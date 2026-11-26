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
const WITNESS_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x58])

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

function scalarInt(v: unknown): number {
  const big = scalarBigInt(v)
  return big > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : Number(big)
}

function parseManifestFile(raw: Buffer): StatyEpochManifest | undefined {
  if (raw.length < 4 || !raw.subarray(0, 4).equals(MANIFEST_MAGIC)) return undefined
  const decoded = RLP.decode(raw.subarray(4)) as unknown[]
  if (!Array.isArray(decoded) || decoded.length < 5) return undefined
  const shardsRaw = decoded[4] as unknown[]
  const shards: StatyEpochShardRow[] = []
  if (Array.isArray(shardsRaw)) {
    for (const row of shardsRaw) {
      if (!Array.isArray(row) || row.length < 5) continue
      shards.push({
        shardIndex: scalarInt(row[0]),
        partCount: scalarInt(row[1]),
        accountCount: scalarInt(row[2]),
        slotCount: scalarInt(row[3]),
        totalBytes: scalarInt(row[4]),
      })
    }
  }
  const anchorStateRoot = decoded[2]
  if (!(anchorStateRoot instanceof Uint8Array) || anchorStateRoot.length !== 32) return undefined
  return {
    epochNumber: scalarBigInt(decoded[0]),
    anchorBlock: scalarBigInt(decoded[1]),
    anchorStateRoot,
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
      if (!Array.isArray(row) || row.length < 2) continue
      if (!(row[0] instanceof Uint8Array) || !(row[1] instanceof Uint8Array)) continue
      accounts.push({ accountHash: row[0], accountRlpOrEmpty: row[1] })
    }
  }
  const slots: StatyEpochPart['slots'] = []
  if (Array.isArray(slotsRaw)) {
    for (const row of slotsRaw) {
      if (!Array.isArray(row) || row.length < 3) continue
      if (
        !(row[0] instanceof Uint8Array) ||
        !(row[1] instanceof Uint8Array) ||
        !(row[2] instanceof Uint8Array)
      ) {
        continue
      }
      slots.push({
        accountHash: row[0],
        slotHash: row[1],
        slotValOrEmpty: row[2],
      })
    }
  }
  const proofNodes = Array.isArray(proofRaw)
    ? proofRaw.filter((n): n is Uint8Array => n instanceof Uint8Array)
    : []
  const anchorStateRoot = decoded[3]
  if (!(anchorStateRoot instanceof Uint8Array) || anchorStateRoot.length !== 32) return undefined
  const epochNumber = scalarBigInt(decoded[0])
  return {
    epochNumber,
    shardIndex: scalarInt(decoded[1]),
    partIndex: scalarInt(decoded[2]),
    anchorBlock: epochNumber * 256n,
    anchorStateRoot,
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

  private _loadDiskWitness(accountHash: Uint8Array): StatyWitnessRecord[] {
    if (this._dataDir === undefined) return []
    const hex = bytesToUnprefixedHex(accountHash)
    const file = path.join(this._dataDir, 'witnesses', `${hex}.rlp`)
    try {
      if (!fs.existsSync(file)) return []
      const raw = fs.readFileSync(file)
      if (raw.length < 4 || !raw.subarray(0, 4).equals(WITNESS_MAGIC)) return []
      const decoded = RLP.decode(raw.subarray(4)) as unknown[]
      if (!Array.isArray(decoded) || decoded.length < 5) return []
      const anchorBlock = scalarBigInt(decoded[0])
      const anchorStateRoot = decoded[1]
      if (!(anchorStateRoot instanceof Uint8Array) || anchorStateRoot.length !== 32) return []
      const accountsRaw = Array.isArray(decoded[2]) ? (decoded[2] as unknown[]) : []
      const slotsRaw = Array.isArray(decoded[3]) ? (decoded[3] as unknown[]) : []
      const proofRaw = Array.isArray(decoded[4]) ? (decoded[4] as unknown[]) : []
      let accountRlpOrEmpty: Uint8Array = new Uint8Array(0)
      let foundAccount = false
      for (const row of accountsRaw) {
        if (!Array.isArray(row) || row.length < 2) continue
        if (!(row[0] instanceof Uint8Array) || !(row[1] instanceof Uint8Array)) continue
        if (bytesToUnprefixedHex(row[0]) === hex) {
          accountRlpOrEmpty = row[1]
          foundAccount = true
          break
        }
      }
      if (!foundAccount) return []
      const slots: Array<{ slotHash: Uint8Array; slotValOrEmpty: Uint8Array }> = []
      for (const row of slotsRaw) {
        if (!Array.isArray(row) || row.length < 3) continue
        if (
          !(row[0] instanceof Uint8Array) ||
          !(row[1] instanceof Uint8Array) ||
          !(row[2] instanceof Uint8Array)
        ) {
          continue
        }
        if (bytesToUnprefixedHex(row[0]) !== hex) continue
        slots.push({ slotHash: row[1], slotValOrEmpty: row[2] })
      }
      const proofNodes = proofRaw.filter((n): n is Uint8Array => n instanceof Uint8Array)
      const rec: StatyWitnessRecord = {
        accountHash,
        anchorBlock,
        anchorStateRoot,
        accountRlpOrEmpty,
        slots,
        proofNodes,
      }
      this._witnesses.set(hex, [rec])
      return [rec]
    } catch {
      return []
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
      const keyHex = bytesToUnprefixedHex(q.accountHash)
      const records = this._witnesses.get(keyHex) ?? this._loadDiskWitness(q.accountHash)
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
