import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

import type { EthySpine } from '../spine/types.ts'

export function refreshEthyWorkerAdvertisement(client: Devp2pWorkerClient, spine: EthySpine): void {
  if (spine.pivotBlockNumber === undefined || spine.pivotStateRoot === undefined) return
  const mask = spine.ethyBucketsBitmask ?? 0
  const pivotStr = spine.pivotBlockNumber.toString()
  const earliest =
    mask === 0xffff
      ? (spine.pivotBlockNumber + 1n).toString()
      : (spine.serving?.earliestBlock ?? pivotStr)
  const latest =
    spine.lastVerifiedBlockNumber !== undefined
      ? spine.lastVerifiedBlockNumber.toString()
      : (spine.serving?.latestBlock ?? spine.headBlockNumber?.toString() ?? pivotStr)
  client.setEthyStatus({
    basePivotBlock: pivotStr,
    basePivotStateRoot: bytesToUnprefixedHex(spine.pivotStateRoot),
    bucketsBitmask: mask === 0 ? '0' : `0x${mask.toString(16)}`,
    balEarliestBlock: earliest,
    balLatestBlock: latest,
  })
}

export function syncEthyPivotServeDir(
  client: Devp2pWorkerClient,
  accountsDir: string | undefined,
): void {
  client.setEthyPivotAccountsDir(accountsDir)
}
