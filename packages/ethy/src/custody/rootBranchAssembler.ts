import { RLP } from '@ethereumjs/rlp'
import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

export type RootBranchKeccak = (data: Uint8Array) => Uint8Array

/** Build canonical 16-way root branch RLP (`RLP([h_0..h_f, 0x])`). */
export function encodeRootBranch(slots: readonly Uint8Array[]): Uint8Array {
  if (slots.length !== 16) {
    throw new Error('encodeRootBranch expects 16 bucket slots')
  }
  return RLP.encode([...slots, new Uint8Array(0)] as never)
}

export function verifyRootBranch(
  slots: readonly Uint8Array[],
  stateRoot: Uint8Array,
  keccak256: RootBranchKeccak,
): boolean {
  return equalsBytes(keccak256(encodeRootBranch(slots)), stateRoot)
}

export type BucketRootCandidates = Map<number, Map<string, Uint8Array>>

/** Merge gossiped or local `h_b` candidates keyed by peer id hex. */
export function noteSubtreeRootCandidate(
  book: BucketRootCandidates,
  bucket: number,
  peerIdHex: string,
  subtreeRootHash: Uint8Array,
): void {
  if (bucket < 0 || bucket > 15 || subtreeRootHash.length !== 32) return
  let perBucket = book.get(bucket)
  if (perBucket === undefined) {
    perBucket = new Map()
    book.set(bucket, perBucket)
  }
  perBucket.set(peerIdHex, new Uint8Array(subtreeRootHash))
}

export type RootAssemblyResult =
  | {
      ok: true
      slots: Uint8Array[]
      rootNodeRlp: Uint8Array
      byzantinePeerIds: string[]
    }
  | { ok: false; reason: 'incomplete' | 'conflict' | 'mismatch' }

function uniqueHashes(perBucket: Map<string, Uint8Array>): Uint8Array[] {
  const seen = new Map<string, Uint8Array>()
  for (const h of perBucket.values()) {
    seen.set(bytesToUnprefixedHex(h), h)
  }
  return [...seen.values()]
}

function cartesian<T>(arrays: T[][]): T[][] {
  let acc: T[][] = [[]]
  for (const arr of arrays) {
    const next: T[][] = []
    for (const prefix of acc) {
      for (const item of arr) {
        next.push([...prefix, item])
      }
    }
    acc = next
  }
  return acc
}

/**
 * Resolve `RootNode` from per-bucket candidate sets. Up to two buckets may have
 * multiple distinct hashes; beyond that assembly fails unless snap bootstrap supplies slots.
 */
export function assembleRootBranch(
  candidates: BucketRootCandidates,
  stateRoot: Uint8Array,
  keccak256: RootBranchKeccak,
): RootAssemblyResult {
  const slotOptions: Uint8Array[][] = []
  let conflictBuckets = 0
  for (let b = 0; b < 16; b++) {
    const per = candidates.get(b)
    if (per === undefined || per.size === 0) {
      return { ok: false, reason: 'incomplete' }
    }
    const uniq = uniqueHashes(per)
    if (uniq.length > 1) conflictBuckets++
    if (conflictBuckets > 2) {
      return { ok: false, reason: 'conflict' }
    }
    slotOptions.push(uniq.length > 0 ? uniq : [new Uint8Array(0)])
  }
  for (const pick of cartesian(slotOptions)) {
    const slots = pick as Uint8Array[]
    if (!verifyRootBranch(slots, stateRoot, keccak256)) continue
    const chosenByBucket = new Map<number, Uint8Array>()
    for (let b = 0; b < 16; b++) chosenByBucket.set(b, slots[b]!)
    const byzantine: string[] = []
    for (let b = 0; b < 16; b++) {
      const proven = slots[b]!
      const per = candidates.get(b)!
      for (const [peer, hash] of per) {
        if (!slotBytesEqual(hash, proven)) byzantine.push(peer)
      }
    }
    return {
      ok: true,
      slots,
      rootNodeRlp: encodeRootBranch(slots),
      byzantinePeerIds: [...new Set(byzantine)],
    }
  }
  return { ok: false, reason: 'mismatch' }
}

function slotBytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  if (a.length === 0 && b.length === 0) return true
  return equalsBytes(a, b)
}

/** Decode snap `GetTrieNodes` root branch into 16 branch slots (values only). */
export function decodeRootBranchSlots(rootNodeRlp: Uint8Array): Uint8Array[] {
  const decoded = RLP.decode(rootNodeRlp) as unknown[]
  if (!Array.isArray(decoded) || decoded.length < 17) {
    throw new Error('Invalid root branch RLP')
  }
  const slots: Uint8Array[] = []
  for (let i = 0; i < 16; i++) {
    const row = decoded[i]
    slots.push(row instanceof Uint8Array ? new Uint8Array(row) : new Uint8Array(0))
  }
  return slots
}
