import { findBucketByPrefix } from '../spine/buckets.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function dropPeer(spine: EthySpine, peerId: string): WidgetSpec {
  const id = peerId.trim().toLowerCase()
  if (!spine.peers.has(id)) {
    return {
      kind: 'key_value',
      title: 'Drop peer',
      entries: [{ key: 'Error', value: `Unknown peer "${peerId}"` }],
    }
  }
  spine.peers.delete(id)
  deriveCapabilities(spine)
  return {
    kind: 'key_value',
    title: 'Drop peer',
    entries: [{ key: 'Dropped', value: id }],
    assistantComment: `${spine.peers.size} peers remain.`,
  }
}

export function reassignBucket(spine: EthySpine, bucketArg: string): WidgetSpec {
  const bucket = findBucketByPrefix(spine.snapBuckets, bucketArg.trim())
  if (bucket === undefined) {
    return {
      kind: 'key_value',
      title: 'Reassign bucket',
      entries: [{ key: 'Error', value: `Invalid bucket "${bucketArg}" (use 0x0..0xf)` }],
    }
  }
  bucket.status = 'pending'
  bucket.lastStallReason = undefined
  bucket.assignedPeerId = undefined
  deriveCapabilities(spine)
  return {
    kind: 'key_value',
    title: 'Reassign bucket',
    entries: [
      { key: 'Bucket', value: bucket.prefix },
      { key: 'Status', value: 'pending' },
    ],
    assistantComment: 'Bucket queued for a new peer assignment.',
  }
}
