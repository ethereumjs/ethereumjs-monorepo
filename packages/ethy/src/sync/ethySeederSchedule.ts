import type { Address, BALJSONBlockAccessList } from '@ethereumjs/util'
import { equalsBytes, hexToBytes } from '@ethereumjs/util'

import { accountHashFromAddress } from './syncedAccountHash.ts'

export type EthySeederDescriptor = {
  peerId: string
  basePivotRoot: Uint8Array
  basePivotBlock: bigint
  bucketsBitmask: number
  balEarliestBlock: bigint
  balLatestBlock: bigint
  avgLatencyMs?: number
}

export type BucketAssignment = {
  peerId: string
  basePivotBlock: bigint
  basePivotRoot: Uint8Array
}

export type AssignBucketsResult = {
  assignments: Map<number, BucketAssignment>
  bucketPivotBlocks: bigint[]
  bucketPivotRoots: Uint8Array[]
  crossSnapshot: boolean
  fallbackSingleSnapshot: boolean
}

function snapshotKey(block: bigint, root: Uint8Array): string {
  return `${block.toString()}:${Buffer.from(root).toString('hex')}`
}

function groupSeeders(seeders: EthySeederDescriptor[]): Map<string, EthySeederDescriptor[]> {
  const groups = new Map<string, EthySeederDescriptor[]>()
  for (const s of seeders) {
    const key = snapshotKey(s.basePivotBlock, s.basePivotRoot)
    const row = groups.get(key)
    if (row === undefined) groups.set(key, [s])
    else row.push(s)
  }
  return groups
}

function pickPeerFromGroup(
  group: EthySeederDescriptor[],
  load: Map<string, number>,
): EthySeederDescriptor {
  let best = group[0]!
  let bestLoad = load.get(best.peerId) ?? 0
  for (let i = 1; i < group.length; i++) {
    const s = group[i]!
    const n = load.get(s.peerId) ?? 0
    if (n < bestLoad) {
      best = s
      bestLoad = n
    }
  }
  return best
}

function balRangeCovers(
  seeders: EthySeederDescriptor[],
  fromExclusive: bigint,
  through: bigint,
): boolean {
  if (through <= fromExclusive) return true
  const needFrom = fromExclusive + 1n
  for (let b = needFrom; b <= through; b += 1n) {
    let ok = false
    for (const s of seeders) {
      if (s.balEarliestBlock <= b && s.balLatestBlock >= b) {
        ok = true
        break
      }
    }
    if (!ok) return false
  }
  return true
}

function tryAssignFromGroups(
  groupsSorted: EthySeederDescriptor[][],
  assignedLoad: Map<string, number>,
): AssignBucketsResult | undefined {
  const assignments = new Map<number, BucketAssignment>()
  const bucketPivotBlocks = Array.from({ length: 16 }, () => 0n)
  const bucketPivotRoots = Array.from({ length: 16 }, () => new Uint8Array(32))
  for (let b = 0; b < 16; b++) {
    let chosen: EthySeederDescriptor | undefined
    for (const group of groupsSorted) {
      const sample = group[0]!
      if ((sample.bucketsBitmask & (1 << b)) === 0) continue
      chosen = pickPeerFromGroup(group, assignedLoad)
      break
    }
    if (chosen === undefined) return undefined
    assignments.set(b, {
      peerId: chosen.peerId,
      basePivotBlock: chosen.basePivotBlock,
      basePivotRoot: chosen.basePivotRoot,
    })
    bucketPivotBlocks[b] = chosen.basePivotBlock
    bucketPivotRoots[b] = new Uint8Array(chosen.basePivotRoot)
  }
  const pivots = bucketPivotBlocks.filter((_, i) => assignments.has(i))
  const bMin = pivots.length > 0 ? pivots.reduce((a, c) => (c < a ? c : a)) : 0n
  const bMax = pivots.length > 0 ? pivots.reduce((a, c) => (c > a ? c : a)) : 0n
  const cross = bMin !== bMax
  return {
    assignments,
    bucketPivotBlocks,
    bucketPivotRoots,
    crossSnapshot: cross,
    fallbackSingleSnapshot: false,
  }
}

/** Freshness-first bucket assignment with BAL coverage check (WP-06g). */
export function assignBuckets(
  seeders: EthySeederDescriptor[],
  assignedLoad: Map<string, number> = new Map(),
): AssignBucketsResult | undefined {
  if (seeders.length === 0) return undefined
  const groups = groupSeeders(seeders)
  const groupList = [...groups.values()]
  groupList.sort((a, b) => {
    const ba = a[0]!.basePivotBlock
    const bb = b[0]!.basePivotBlock
    if (ba === bb) return 0
    return ba > bb ? -1 : 1
  })

  const draft = tryAssignFromGroups(groupList, assignedLoad)
  if (draft === undefined) return undefined

  const involved = new Set<string>()
  for (const a of draft.assignments.values()) involved.add(a.peerId)
  const involvedSeeders = seeders.filter((s) => involved.has(s.peerId))
  const pivots = draft.bucketPivotBlocks.filter((v) => v > 0n)
  const bMin = pivots.reduce((a, c) => (c < a ? c : a), draft.bucketPivotBlocks[0] ?? 0n)
  const bMax = pivots.reduce((a, c) => (c > a ? c : a), 0n)
  if (draft.crossSnapshot && !balRangeCovers(involvedSeeders, bMin, bMax)) {
    for (const group of groupList) {
      const single = tryAssignFromGroups([group], assignedLoad)
      if (single !== undefined) {
        return { ...single, fallbackSingleSnapshot: true }
      }
    }
    return undefined
  }
  return draft
}

export function bucketNibbleFromAddress(address: Address): number {
  const hash = accountHashFromAddress(address.toString())
  return hash[0]! >> 4
}

export function bucketPivotMinMax(bucketPivotBlocks: readonly bigint[]): {
  bMin: bigint
  bMax: bigint
  uniform: boolean
} {
  const pivots = bucketPivotBlocks.slice(0, 16).filter((p) => p > 0n)
  if (pivots.length === 0) {
    return { bMin: 0n, bMax: 0n, uniform: true }
  }
  const bMin = pivots.reduce((a, c) => (c < a ? c : a))
  const bMax = pivots.reduce((a, c) => (c > a ? c : a))
  return { bMin, bMax, uniform: bMin === bMax }
}

/** Per-block `shouldApplyAccount` when bucket pivots differ (WP-06g). */
export function shouldApplyBalAtBlock(
  bucketPivotBlocks: readonly bigint[],
  blockNumber: bigint,
): ((address: Address) => boolean) | undefined {
  const { bMax, uniform } = bucketPivotMinMax(bucketPivotBlocks)
  if (uniform || bMax === 0n) return undefined
  if (blockNumber > bMax) return undefined
  return (address) => {
    const b = bucketNibbleFromAddress(address)
    return bucketPivotBlocks[b]! < blockNumber
  }
}

export type BalApplySegment = {
  fromBlock: bigint
  toBlock: bigint
  accessLists: BALJSONBlockAccessList[]
  shouldApplyAccount?: (address: Address) => boolean
}

function activeBucketMaskAtBlock(
  bucketPivotBlocks: readonly bigint[],
  blockNumber: bigint,
): number {
  const { bMax, uniform } = bucketPivotMinMax(bucketPivotBlocks)
  if (uniform || bMax === 0n || blockNumber > bMax) return 0xffff
  let mask = 0
  for (let b = 0; b < 16; b++) {
    if ((bucketPivotBlocks[b] ?? 0n) < blockNumber) {
      mask |= 1 << b
    }
  }
  return mask
}

/**
 * Group consecutive BAL blocks that share the exact same active bucket mask
 * so each contiguous segment can be compacted and applied via `consumeBALBatch` (WP-06g).
 */
export function balApplySegments(
  bucketPivotBlocks: readonly bigint[],
  rows: ReadonlyArray<{ blockNumber: bigint; balJson: BALJSONBlockAccessList }>,
): BalApplySegment[] {
  if (rows.length === 0) return []
  const segments: BalApplySegment[] = []
  let currentMask = -1
  let currentSegment: BalApplySegment | undefined

  for (const row of rows) {
    const mask = activeBucketMaskAtBlock(bucketPivotBlocks, row.blockNumber)
    if (mask === 0) continue
    if (currentSegment === undefined || mask !== currentMask) {
      currentMask = mask
      const shouldApplyAccount =
        mask === 0xffff
          ? undefined
          : (address: Address) => {
              const b = bucketNibbleFromAddress(address)
              return (mask & (1 << b)) !== 0
            }
      currentSegment = {
        fromBlock: row.blockNumber,
        toBlock: row.blockNumber,
        accessLists: [row.balJson],
        shouldApplyAccount,
      }
      segments.push(currentSegment)
    } else {
      currentSegment.toBlock = row.blockNumber
      currentSegment.accessLists.push(row.balJson)
    }
  }
  return segments
}

export function seederCoversBalRange(
  seeder: EthySeederDescriptor,
  fromBlock: bigint,
  count: bigint,
): boolean {
  if (count <= 0n) return true
  const to = fromBlock + count - 1n
  return seeder.balEarliestBlock <= fromBlock && seeder.balLatestBlock >= to
}

export function seederFromWorkerStatus(
  peerId: string,
  st: {
    basePivotBlock: string
    basePivotStateRoot: string
    bucketsBitmask: string
    balEarliestBlock?: string
    balLatestBlock?: string
  },
): EthySeederDescriptor | undefined {
  const rootHex = st.basePivotStateRoot
  if (rootHex.length === 0) return undefined
  const root = hexToBytes((rootHex.startsWith('0x') ? rootHex : `0x${rootHex}`) as `0x${string}`)
  const basePivotBlock = BigInt(st.basePivotBlock)
  const maskRaw = st.bucketsBitmask
  const bucketsBitmask = maskRaw.startsWith('0x')
    ? Number.parseInt(maskRaw, 16)
    : Number.parseInt(maskRaw, 10)
  const balEarliestBlock =
    st.balEarliestBlock !== undefined ? BigInt(st.balEarliestBlock) : basePivotBlock
  const balLatestBlock =
    st.balLatestBlock !== undefined ? BigInt(st.balLatestBlock) : basePivotBlock
  return {
    peerId,
    basePivotRoot: root,
    basePivotBlock,
    bucketsBitmask,
    balEarliestBlock,
    balLatestBlock,
  }
}

export function peersOnSnapshot(
  seeders: EthySeederDescriptor[],
  pivotBlock: bigint,
  pivotRoot: Uint8Array,
): EthySeederDescriptor[] {
  return seeders.filter(
    (s) => s.basePivotBlock === pivotBlock && equalsBytes(s.basePivotRoot, pivotRoot),
  )
}
