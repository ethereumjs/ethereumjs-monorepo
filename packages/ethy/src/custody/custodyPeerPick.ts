import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'

type EthyPeerStatusView = NonNullable<WorkerPeerSnapshot['ethyStatus']>

function ethyMaskFromStatus(
  st: EthyPeerStatusView,
  plane: 'buckets' | 'code' | 'storage' | 'trie',
): number {
  const raw =
    plane === 'buckets'
      ? st.bucketsBitmask
      : plane === 'code'
        ? (st.codeBucketsBitmask ?? '0')
        : plane === 'storage'
          ? (st.storageBucketsBitmask ?? '0')
          : (st.trieBucketsBitmask ?? '0')
  if (raw.startsWith('0x')) return Number.parseInt(raw, 16)
  return Number.parseInt(raw, 10)
}

/** Prefer highest `basePivotBlock` (and `trieBucketsBitmask` when requested) among peers advertising custody for bucket `b`. */
export function pickEthyCustodianForBucket(
  peers: WorkerPeerSnapshot[],
  bucket: number,
  plane: 'accounts' | 'code' | 'storage',
  opts?: { preferTrie?: boolean },
): WorkerPeerSnapshot | undefined {
  const candidates = peers.filter((p) => {
    if (p.ethySession !== true || p.ethyStatus === undefined) return false
    const mask = ethyMaskFromStatus(p.ethyStatus, plane === 'accounts' ? 'buckets' : plane)
    return (mask & (1 << bucket)) !== 0
  })
  if (candidates.length === 0) return undefined
  const preferTrie = opts?.preferTrie === true
  candidates.sort((a, b) => {
    if (preferTrie) {
      const aTrie = (ethyMaskFromStatus(a.ethyStatus!, 'trie') & (1 << bucket)) !== 0 ? 1 : 0
      const bTrie = (ethyMaskFromStatus(b.ethyStatus!, 'trie') & (1 << bucket)) !== 0 ? 1 : 0
      if (aTrie !== bTrie) return bTrie - aTrie
    }
    const ab = BigInt(a.ethyStatus?.basePivotBlock ?? '0')
    const bb = BigInt(b.ethyStatus?.basePivotBlock ?? '0')
    return ab > bb ? -1 : ab < bb ? 1 : 0
  })
  return candidates[0]
}

/**
 * Code custodians ordered for content-addressed `codeHash` fetches.
 * `codeBucketsBitmask` indexes by contract `accountHash[0] >> 4`, not `codeHash[0] >> 4`,
 * so any peer advertising nonzero `codeBucketsBitmask` may hold the bytecode.
 */
export function pickEthyCodeCustodians(
  peers: WorkerPeerSnapshot[],
  preferredBucket: number,
): WorkerPeerSnapshot[] {
  const candidates = peers.filter((p) => {
    if (p.ethySession !== true || p.ethyStatus === undefined) return false
    return ethyMaskFromStatus(p.ethyStatus, 'code') !== 0
  })
  candidates.sort((a, b) => {
    const aMask = ethyMaskFromStatus(a.ethyStatus!, 'code')
    const bMask = ethyMaskFromStatus(b.ethyStatus!, 'code')
    const aPref = (aMask & (1 << preferredBucket)) !== 0 ? 1 : 0
    const bPref = (bMask & (1 << preferredBucket)) !== 0 ? 1 : 0
    if (aPref !== bPref) return bPref - aPref
    const ab = BigInt(a.ethyStatus?.basePivotBlock ?? '0')
    const bb = BigInt(b.ethyStatus?.basePivotBlock ?? '0')
    return ab > bb ? -1 : ab < bb ? 1 : 0
  })
  return candidates
}
