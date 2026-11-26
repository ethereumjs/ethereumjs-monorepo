import * as fs from 'node:fs'
import * as path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

import {
  MAX_ETHY_PROOF_NODES,
  MAX_WITNESS_ACCOUNTS,
  MAX_WITNESS_SLOTS,
} from '../protocol/ethy/codec.ts'

export type EthyWitnessRecord = {
  accountHash: Uint8Array
  anchorBlock: bigint
  anchorStateRoot: Uint8Array
  accountRlpOrEmpty: Uint8Array
  slots: Array<{ slotHash: Uint8Array; slotValOrEmpty: Uint8Array }>
  proofNodes: Uint8Array[]
}

export type EthyWitnessQuery = {
  accountHash: Uint8Array
  slotHashes: Uint8Array[]
}

/** Optional synchronous generator hook for Option C live subtree tries (`WP-16f`). */
export type EthyWitnessGenerator = (
  minAnchorBlock: bigint,
  query: EthyWitnessQuery,
) => EthyWitnessRecord | undefined

const WITNESS_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x58])
const MAX_RECORDS_PER_ACCOUNT = 8

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i]! < b[i]!) return -1
    if (a[i]! > b[i]!) return 1
  }
  return a.length - b.length
}

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

/** In-worker ETHY/0 witness cache (RAM + optional `witnesses/` disk + live trie hook). */
export class EthyWitnessStore {
  private readonly _witnesses = new Map<string, EthyWitnessRecord[]>()
  private _dataDir: string | undefined
  private _generator: EthyWitnessGenerator | undefined

  setDataDir(dir: string | undefined): void {
    this._dataDir = dir
  }

  /** Register an optional non-blocking witness generator (e.g. `WP-16f` live subtree trie). */
  setWitnessGenerator(generator: EthyWitnessGenerator | undefined): void {
    this._generator = generator
  }

  putWitness(record: EthyWitnessRecord): void {
    const key = bytesToUnprefixedHex(record.accountHash)
    const list = this._witnesses.get(key) ?? []
    const existingIdx = list.findIndex((r) => r.anchorBlock === record.anchorBlock)
    if (existingIdx >= 0) {
      list[existingIdx] = record
    } else {
      list.push(record)
    }
    list.sort((a, b) =>
      b.anchorBlock > a.anchorBlock ? 1 : b.anchorBlock < a.anchorBlock ? -1 : 0,
    )
    if (list.length > MAX_RECORDS_PER_ACCOUNT) {
      list.length = MAX_RECORDS_PER_ACCOUNT
    }
    this._witnesses.set(key, list)
  }

  private _loadDiskWitness(accountHash: Uint8Array): EthyWitnessRecord[] {
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
      const rec: EthyWitnessRecord = {
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
    queries: readonly EthyWitnessQuery[],
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
        slotKeys: Set<string>
      }
    >()
    let budget = maxBytes
    let totalSlots = 0
    let totalProofNodes = 0
    const accountQueries = queries.slice(0, MAX_WITNESS_ACCOUNTS)

    for (const q of accountQueries) {
      if (q.accountHash.length !== 32) continue
      const keyHex = bytesToUnprefixedHex(q.accountHash)
      const records = this._witnesses.get(keyHex) ?? this._loadDiskWitness(q.accountHash)
      let best = records
        .filter((r) => r.anchorBlock >= minAnchorBlock)
        .sort((a, b) =>
          b.anchorBlock > a.anchorBlock ? 1 : b.anchorBlock < a.anchorBlock ? -1 : 0,
        )[0]
      if (best === undefined && this._generator !== undefined) {
        const generated = this._generator(minAnchorBlock, q)
        if (generated !== undefined && generated.anchorBlock >= minAnchorBlock) {
          best = generated
        }
      }
      if (best === undefined) continue

      const gKey = `${best.anchorBlock}:${bytesToUnprefixedHex(best.anchorStateRoot)}`
      let group = groups.get(gKey)
      const existingKeys = group?.proofKeys
      const newProofs: Uint8Array[] = []
      const seenNew = new Set<string>()
      let newProofBytes = 0
      for (const node of best.proofNodes) {
        const nk = bytesToUnprefixedHex(node)
        if (existingKeys?.has(nk) === true || seenNew.has(nk)) continue
        seenNew.add(nk)
        newProofs.push(node)
        newProofBytes += node.length
      }

      const acctHex = bytesToUnprefixedHex(q.accountHash)
      const needAccount =
        group === undefined ||
        !group.accounts.some((a) => bytesToUnprefixedHex(a.accountHash) === acctHex)
      const accountCost = needAccount ? best.accountRlpOrEmpty.length + 64 : 0
      if (budget < accountCost + newProofBytes) continue
      if (totalProofNodes + newProofs.length > MAX_ETHY_PROOF_NODES) continue

      if (group === undefined) {
        group = {
          anchorBlock: best.anchorBlock,
          anchorStateRoot: best.anchorStateRoot,
          accounts: [],
          slots: [],
          proofNodes: [],
          proofKeys: new Set<string>(),
          slotKeys: new Set<string>(),
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
        if (totalSlots >= MAX_WITNESS_SLOTS) break
        if (slotHash.length !== 32) continue
        const slotHex = bytesToUnprefixedHex(slotHash)
        const sk = `${acctHex}:${slotHex}`
        if (group.slotKeys.has(sk)) continue
        const slot = best.slots.find((s) => bytesToUnprefixedHex(s.slotHash) === slotHex)
        if (slot === undefined) continue
        const est = 64 + slot.slotValOrEmpty.length
        if (budget < est) continue
        group.slotKeys.add(sk)
        group.slots.push({
          accountHash: q.accountHash,
          slotHash,
          slotValOrEmpty: slot.slotValOrEmpty,
        })
        totalSlots++
        budget -= est
      }
    }

    return [...groups.values()].map(({ proofKeys: _pk, slotKeys: _sk, ...rest }) => {
      rest.accounts.sort((a, b) => compareBytes32(a.accountHash, b.accountHash))
      rest.slots.sort((a, b) => {
        const acctCmp = compareBytes32(a.accountHash, b.accountHash)
        return acctCmp !== 0 ? acctCmp : compareBytes32(a.slotHash, b.slotHash)
      })
      return rest
    })
  }
}
