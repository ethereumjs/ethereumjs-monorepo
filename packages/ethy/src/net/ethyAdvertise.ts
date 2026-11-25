import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

import type { EthySpine } from '../spine/types.ts'

export function refreshEthyWorkerAdvertisement(client: Devp2pWorkerClient, spine: EthySpine): void {
  if (spine.pivotBlockNumber === undefined || spine.pivotStateRoot === undefined) return
  const mask = spine.ethyBucketsBitmask ?? 0
  const pivotStr = spine.pivotBlockNumber.toString()
  const servingEthy = spine.machine?.servingEthy
  const pausedServing =
    servingEthy === 'paused-catching-up' ||
    servingEthy === 'paused-stale' ||
    servingEthy === 'paused-bal-gap'
  const tailEarliest = spine.swarm?.balTailEarliest
  const earliest =
    tailEarliest !== undefined
      ? tailEarliest.toString()
      : mask === 0xffff && !pausedServing
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

/** Partial-generation minter heartbeat while shadow refresh mints (WP-11b). */
export function refreshShadowMinterAdvertisement(
  client: Devp2pWorkerClient,
  opts: {
    pivotBlock: bigint
    stateRoot: Uint8Array
    bucketsMask: number
    balEarliest: bigint
    balLatest: bigint
  },
): void {
  client.setEthyStatus({
    basePivotBlock: opts.pivotBlock.toString(),
    basePivotStateRoot: bytesToUnprefixedHex(opts.stateRoot),
    bucketsBitmask: opts.bucketsMask === 0 ? '0' : `0x${opts.bucketsMask.toString(16)}`,
    balEarliestBlock: opts.balEarliest.toString(),
    balLatestBlock: opts.balLatest.toString(),
  })
}

export function syncEthyPivotServeDir(
  client: Devp2pWorkerClient,
  accountsDir: string | undefined,
): void {
  client.setEthyPivotAccountsDir(accountsDir)
}
