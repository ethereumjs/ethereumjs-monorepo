import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'

type EthyPeerStatusView = NonNullable<WorkerPeerSnapshot['ethyStatus']>

function ethyMaskFromStatus(st: EthyPeerStatusView, plane: 'buckets' | 'code' | 'storage'): number {
  const raw =
    plane === 'buckets'
      ? st.bucketsBitmask
      : plane === 'code'
        ? (st.codeBucketsBitmask ?? '0')
        : (st.storageBucketsBitmask ?? '0')
  if (raw.startsWith('0x')) return Number.parseInt(raw, 16)
  return Number.parseInt(raw, 10)
}

/** Prefer highest `basePivotBlock` among peers advertising custody for bucket `b`. */
export function pickEthyCustodianForBucket(
  peers: WorkerPeerSnapshot[],
  bucket: number,
  plane: 'accounts' | 'code' | 'storage',
): WorkerPeerSnapshot | undefined {
  const candidates = peers.filter((p) => {
    if (p.ethySession !== true || p.ethyStatus === undefined) return false
    const mask = ethyMaskFromStatus(p.ethyStatus, plane === 'accounts' ? 'buckets' : plane)
    return (mask & (1 << bucket)) !== 0
  })
  if (candidates.length === 0) return undefined
  candidates.sort((a, b) => {
    const ab = BigInt(a.ethyStatus?.basePivotBlock ?? '0')
    const bb = BigInt(b.ethyStatus?.basePivotBlock ?? '0')
    return ab > bb ? -1 : ab < bb ? 1 : 0
  })
  return candidates[0]
}
