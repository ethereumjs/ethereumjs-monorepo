import { bytesToUnprefixedHex } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

export type CustodyPlaneProgress = {
  accounts: boolean
  code: boolean
  storage: boolean
}

export type CustodyActiveMeta = {
  custodyCount?: number
  custodyNodeId?: string
  custodyBuckets?: number[]
  custodyPlanes?: Record<string, CustodyPlaneProgress>
}

const ALL_BUCKETS = Array.from({ length: 16 }, (_, i) => i)

/** Deterministic nibble buckets for `--custody <count>` (WP-16d). */
export function selectCustodyBuckets(nodeId: Uint8Array, count: number): number[] {
  if (count >= 16) return [...ALL_BUCKETS]
  if (count < 1 || count > 15) {
    throw new Error(`custody count must be 1..16 (got ${count})`)
  }
  const start = keccak_256(nodeId)[0]! >> 4
  if (count === 1) return [start & 0xf]
  if (count === 2) return [start & 0xf, (start + 8) & 0xf]
  const out: number[] = []
  const seen = new Set<number>()
  for (let i = 0; i < count; i++) {
    const step = Math.round((i * 16) / count)
    let b = (start + step) & 0xf
    while (seen.has(b)) {
      b = (b + 1) & 0xf
    }
    seen.add(b)
    out.push(b)
  }
  return out
}

export function custodyBitmask(buckets: readonly number[]): number {
  let mask = 0
  for (const b of buckets) {
    if (b < 0 || b > 15) continue
    mask |= 1 << b
  }
  return mask
}

export function loadOrAssignCustody(
  active: CustodyActiveMeta | undefined,
  nodeId: Uint8Array,
  count: number,
): { buckets: number[]; count: number; nodeIdHex: string } {
  const nodeIdHex = bytesToUnprefixedHex(nodeId)
  if (
    active?.custodyNodeId === nodeIdHex &&
    active.custodyCount === count &&
    active.custodyBuckets !== undefined &&
    active.custodyBuckets.length === count
  ) {
    return { buckets: [...active.custodyBuckets], count, nodeIdHex }
  }
  const buckets = selectCustodyBuckets(nodeId, count)
  return { buckets, count, nodeIdHex }
}

export function closedMaskFromCustodyPlanes(
  planes: Record<string, CustodyPlaneProgress> | undefined,
): number {
  if (planes === undefined) return 0
  let mask = 0
  for (const [hex, row] of Object.entries(planes)) {
    const b = Number.parseInt(hex, 16)
    if (Number.isNaN(b) || b < 0 || b > 15) continue
    if (row.accounts && row.code && row.storage) {
      mask |= 1 << b
    }
  }
  return mask
}

export function defaultPlaneProgress(): CustodyPlaneProgress {
  return { accounts: false, code: false, storage: false }
}
