import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import { refreshEthyWorkerAdvertisement } from '../net/ethyAdvertise.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine } from '../spine/types.ts'
import { closedMaskFromCustodyPlanes } from './custodyPlan.ts'

export type CustodyPlane = 'accounts' | 'code' | 'storage'

/** Record plane progress and atomically close bucket + refresh STATUS when all three planes match head (WP-16d). */
export function noteCustodyPlaneComplete(opts: {
  snapStore?: SnapPivotStore
  stateManager: FlatStateManager
  spine: EthySpine
  client: Devp2pWorkerClient
  bucketIndex: number
  plane: CustodyPlane
  headBlock: bigint
}): void {
  const { snapStore, stateManager, spine, client, bucketIndex, plane, headBlock } = opts
  snapStore?.updateCustodyPlane(bucketIndex, { [plane]: true })
  const meta = snapStore?.getCustodyMeta()
  const row = meta?.custodyPlanes?.[bucketIndex.toString(16)]
  if (row === undefined || !row.accounts || !row.code || !row.storage) {
    return
  }
  const last = spine.lastVerifiedBlockNumber ?? spine.headBlockNumber ?? 0n
  if (last < headBlock) {
    return
  }
  stateManager.markBucketClosed(bucketIndex)
  const closed =
    snapStore?.closedBucketsMaskFromPlanes() ?? closedMaskFromCustodyPlanes(meta?.custodyPlanes)
  spine.closedBucketsMask = closed
  spine.ethyBucketsBitmask = closed
  spine.ethyStorageBucketsBitmask = closed
  spine.ethyCodeBucketsBitmask = closed
  refreshEthyWorkerAdvertisement(client, spine)
}
