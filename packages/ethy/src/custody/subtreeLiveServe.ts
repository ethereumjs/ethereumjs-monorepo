import { type Devp2pWorkerClient, EthyMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, bytesToUnprefixedHex } from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { EthySpine } from '../spine/types.ts'
import type { SubtreeCustodyRegistry } from './subtreeCustodyRegistry.ts'
import { buildLiveWitnessGroup } from './subtreeProofServer.ts'
import type { WitnessBuildQuery } from './subtreeProofServer.ts'

function fieldToBigInt(field: unknown): bigint | undefined {
  if (typeof field === 'bigint') return field
  if (field instanceof Uint8Array) {
    if (field.length === 0) return 0n
    let v = 0n
    for (const b of field) v = (v << 8n) + BigInt(b)
    return v
  }
  return undefined
}

function accountBucket(accountHash: Uint8Array): number {
  return accountHash[0]! >> 4
}

function parseWitnessQueries(decoded: unknown):
  | {
      reqId: bigint
      minAnchor: bigint
      maxBytes: number
      queries: WitnessBuildQuery[]
    }
  | undefined {
  if (!Array.isArray(decoded) || decoded.length < 4) return undefined
  const reqId = fieldToBigInt(decoded[0])
  const minAnchor = fieldToBigInt(decoded[1])
  const maxBytes = decoded[2] instanceof Uint8Array ? Number(decoded[2][0] ?? 0) : undefined
  const rawQueries = decoded[3]
  if (reqId === undefined || minAnchor === undefined || maxBytes === undefined) return undefined
  if (!Array.isArray(rawQueries)) return undefined
  const queries: WitnessBuildQuery[] = []
  for (const row of rawQueries) {
    if (!Array.isArray(row) || row.length < 1) continue
    const acct = row[0]
    if (!(acct instanceof Uint8Array) || acct.length !== 32) continue
    const slots: Uint8Array[] = []
    if (Array.isArray(row[1])) {
      for (const s of row[1]) {
        if (s instanceof Uint8Array && s.length === 32) slots.push(s)
      }
    }
    queries.push({ accountHash: acct, slotHashes: slots })
  }
  return { reqId, minAnchor, maxBytes, queries }
}

/** Main-thread `0x0b` → `0x0c` for armed custody buckets (WP-16f). */
export async function answerLiveGetStateWitness(
  registry: SubtreeCustodyRegistry,
  spine: EthySpine,
  decoded: unknown,
): Promise<Uint8Array | undefined> {
  const parsed = parseWitnessQueries(decoded)
  if (parsed === undefined) return undefined
  const anchor =
    spine.pivotBlockNumber !== undefined && spine.pivotBlockNumber >= parsed.minAnchor
      ? spine.pivotBlockNumber
      : parsed.minAnchor
  const anchorRec =
    registry.verifiedAnchor(anchor) ??
    (spine.pivotStateRoot !== undefined
      ? await registry.verifyAnchor(anchor, spine.pivotStateRoot)
      : undefined)
  if (anchorRec === undefined) return undefined

  const groups: Uint8Array[] = []
  const byBucket = new Map<number, WitnessBuildQuery[]>()
  const mask = registry.trieBucketsBitmask()
  for (const q of parsed.queries) {
    const b = accountBucket(q.accountHash)
    if ((mask & (1 << b)) === 0) continue
    const list = byBucket.get(b) ?? []
    list.push(q)
    byBucket.set(b, list)
  }

  for (const [b, qs] of byBucket) {
    const trie = registry.trie(b)
    if (trie === undefined) continue
    const group = await buildLiveWitnessGroup({
      anchorBlock: anchor,
      anchorStateRoot: anchorRec.stateRoot,
      rootNodeRlp: anchorRec.rootNodeRlp,
      trie,
      armed: true,
      anchorId: anchor,
      queries: qs,
    })
    if (group === undefined) continue
    const wireAccounts = group.accounts.map((a) => [a.accountHash, a.accountRlpOrEmpty])
    const wireSlots = group.slots.map((s) => [s.accountHash, s.slotHash, s.slotValOrEmpty])
    groups.push(
      RLP.encode([
        bigIntToUnpaddedBytes(anchor),
        anchorRec.stateRoot,
        wireAccounts,
        wireSlots,
        group.proofNodes,
      ] as never),
    )
  }

  return RLP.encode([bigIntToUnpaddedBytes(parsed.reqId), groups] as never)
}

export async function handleInboundLiveGetStateWitness(
  client: Devp2pWorkerClient,
  peerIdHex: string,
  payload: Uint8Array,
  registry: SubtreeCustodyRegistry,
  spine: EthySpine,
  peerIdToBytes: (hex: string) => Uint8Array,
): Promise<void> {
  let decoded: unknown
  try {
    decoded = RLP.decode(payload)
  } catch {
    return
  }
  const reply = await answerLiveGetStateWitness(registry, spine, decoded)
  if (reply === undefined) return
  client.sendEthyMessage(peerIdToBytes(peerIdHex), EthyMessageCodes.STATE_WITNESS, reply)
}

export function noteInboundSubtreeRootsGossip(
  registry: SubtreeCustodyRegistry,
  peerIdHex: string,
  payload: Uint8Array,
): void {
  let decoded: unknown
  try {
    decoded = RLP.decode(payload)
  } catch {
    return
  }
  if (!Array.isArray(decoded) || decoded.length < 3) return
  const anchor = fieldToBigInt(decoded[1])
  const entries = decoded[2]
  if (anchor === undefined || !Array.isArray(entries)) return
  for (const row of entries) {
    if (!Array.isArray(row) || row.length < 2) continue
    const bField = row[0]
    const hash = row[1]
    const bucket =
      bField instanceof Uint8Array && bField.length > 0
        ? bField[bField.length - 1]!
        : typeof bField === 'number'
          ? bField
          : undefined
    if (bucket === undefined || bucket < 0 || bucket > 15) continue
    if (!(hash instanceof Uint8Array)) continue
    registry.notePeerSubtreeRoot(anchor, bucket, peerIdHex, hash)
  }
}

export function armLiveProofTransport(
  client: Devp2pWorkerClient,
  registry: SubtreeCustodyRegistry,
): void {
  if (registry.trieBucketsBitmask() !== 0) {
    client.setEthyLiveProofMode(true)
  } else {
    client.setEthyLiveProofMode(false)
  }
}
