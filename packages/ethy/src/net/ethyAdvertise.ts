import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

import type { EthySpine } from '../spine/types.ts'

export function refreshEthyWorkerAdvertisement(client: Devp2pWorkerClient, spine: EthySpine): void {
  if (spine.pivotBlockNumber === undefined || spine.pivotStateRoot === undefined) return
  const mask = spine.ethyBucketsBitmask ?? 0
  client.setEthyStatus({
    basePivotBlock: spine.pivotBlockNumber.toString(),
    basePivotStateRoot: bytesToUnprefixedHex(spine.pivotStateRoot),
    bucketsBitmask: mask === 0 ? '0' : `0x${mask.toString(16)}`,
    balEarliestBlock: spine.pivotBlockNumber.toString(),
    balLatestBlock: spine.headBlockNumber?.toString(),
  })
}

export function syncEthyPivotServeDir(
  client: Devp2pWorkerClient,
  accountsDir: string | undefined,
): void {
  client.setEthyPivotAccountsDir(accountsDir)
}
