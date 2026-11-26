import * as fs from 'node:fs'
import * as path from 'node:path'

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
      // Disk manifest parsing deferred — in-memory tests only in WP-16a
      return undefined
    } catch {
      return undefined
    }
  }

  partFor(epochNumber: bigint, shardIndex: number, partIndex: number): StatyEpochPart | undefined {
    return this._parts.get(partKey(epochNumber, shardIndex, partIndex))
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
