import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import { type ChainConfig, Common } from '@ethereumjs/common'
import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  type BALJSONBlockAccessList,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
} from '@ethereumjs/util'

import { setPhase } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'
import type { SnapAccountSynchronizer } from './accountSync.ts'
import type { SnapCodeAndStorageSynchronizer } from './codeAndStorageSync.ts'

export const PIVOT_HEAL_BLOCK_GAP = 64n
export const HEAD_FOLLOW_POLL_MS = 5_000

export function pushBalWindow(
  spine: EthySpine,
  blockNumber: bigint,
  balJson?: BALJSONBlockAccessList,
): void {
  for (const entry of spine.balWindow) {
    delete entry.balJson
  }
  spine.balWindow.unshift({
    blockNumber,
    accountCount: balJson?.length ?? 0,
    balJson,
  })
  if (spine.balWindow.length > 64) {
    spine.balWindow.length = 64
  }
}

export async function applyBlockBal(
  stateManager: FlatStateManager,
  headerRlp: Uint8Array,
  balRlp: Uint8Array | undefined,
  chain: ChainConfig,
  hardfork: string,
): Promise<{ ok: boolean; applied: boolean; balJson?: BALJSONBlockAccessList; reason?: string }> {
  const common = new Common({ chain, hardfork })
  const raw = headerRlp instanceof Uint8Array ? RLP.decode(headerRlp) : headerRlp
  const header = createBlockHeaderFromBytesArray(raw as never, {
    common,
    skipConsensusFormatValidation: true,
  })
  const balHash = header.blockAccessListHash
  if (balHash === undefined || balHash.length === 0) {
    return { ok: true, applied: false }
  }
  if (balRlp === undefined || balRlp.length === 0) {
    return { ok: true, applied: false, reason: 'missing BAL (fallback)' }
  }
  const bal = createBlockLevelAccessListFromRLP(balRlp)
  if (!equalsBytes(bal.hash(), balHash)) {
    return { ok: false, applied: false, reason: 'BAL hash mismatch' }
  }
  const balJson = bal.toJSON()
  await stateManager.consumeBAL(balJson)
  return { ok: true, applied: true, balJson }
}

export function tryEnterHeadFollowing(
  spine: EthySpine,
  accountSync: SnapAccountSynchronizer | undefined,
  codeSync: SnapCodeAndStorageSynchronizer | undefined,
): boolean {
  if (spine.phase !== 'SNAP_SYNCING') return false
  const bucketsDone = spine.snapBuckets.every((b) => b.status === 'done')
  const codeDone = codeSync === undefined || codeSync.pendingDone()
  if (!bucketsDone || !codeDone) return false
  setPhase(spine, 'HEAD_FOLLOWING')
  spine.headBlockNumber = spine.pivotBlockNumber
  spine.headStateRoot = spine.pivotStateRoot
  return true
}

export type HeadFollowerOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  chain: ChainConfig
  getClient: () => Devp2pWorkerClient
  pickEthPeer: () => { id: string; ethVersion: number; latestBlock?: number } | undefined
  putServableBlock: (bundle: {
    number: bigint
    hash: Uint8Array
    headerRlp: Uint8Array
    bodyRlp: Uint8Array
    receiptsEth69Rlp: Uint8Array
    balRlp?: Uint8Array
  }) => void
}

/** Polls peer head and advances one block when caught up in `HEAD_FOLLOWING`. */
export class HeadBlockFollower {
  private readonly opts: HeadFollowerOpts
  private timer?: ReturnType<typeof setInterval>

  constructor(opts: HeadFollowerOpts) {
    this.opts = opts
  }

  start(): void {
    if (this.timer !== undefined) return
    this.timer = setInterval(() => {
      void this.tick()
    }, HEAD_FOLLOW_POLL_MS)
    this.timer.unref?.()
  }

  stop(): void {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = undefined
  }

  private async tick(): Promise<void> {
    const { spine } = this.opts
    if (spine.phase !== 'HEAD_FOLLOWING' || spine.headBlockNumber === undefined) return
    const peer = this.opts.pickEthPeer()
    if (peer?.latestBlock === undefined) return
    const peerHead = BigInt(peer.latestBlock)
    if (peerHead <= spine.headBlockNumber) return
    // Full multi-block catch-up is driven by the coordinator bundle fetch; follower is a hook for extension.
  }
}
