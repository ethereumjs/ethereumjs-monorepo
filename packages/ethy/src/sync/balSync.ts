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
import {
  type InFlightBlockBundle,
  advanceBlockBundleEthMessage,
  finalizeBlockBundle,
  headFieldsFromHeaderRlp,
  startBlockBundleByNumber,
} from './blockBundle.ts'
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
  hardfork: string
  getClient: () => Devp2pWorkerClient
  sendEthMessage: (peerId: string, code: number, payload: Uint8Array) => void
  pickEthPeer: () => { id: string; ethVersion: number; latestBlock?: number } | undefined
  putServableBlock: (bundle: {
    number: bigint
    hash: Uint8Array
    headerRlp: Uint8Array
    bodyRlp: Uint8Array
    receiptsEth69Rlp: Uint8Array
    balRlp?: Uint8Array
  }) => void
  onBalApplied?: (balJson: BALJSONBlockAccessList) => void
  appendHealBal?: (blockNumber: bigint, balRlp: Uint8Array) => void
}

type HeadCatchUp = {
  peerId: string
  ethVersion: number
  targetHead: bigint
  inFlight?: InFlightBlockBundle
}

/** Polls peer head and advances block-by-block in `HEAD_FOLLOWING`. */
export class HeadBlockFollower {
  private readonly opts: HeadFollowerOpts
  private timer?: ReturnType<typeof setInterval>
  private catchUp?: HeadCatchUp

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
    this.catchUp = undefined
  }

  handleEthMessage(msg: { peerId: string; code: number; payload: Uint8Array }): boolean {
    const inFlight = this.catchUp?.inFlight
    if (inFlight === undefined) return false
    const result = advanceBlockBundleEthMessage(
      this.opts.chain,
      inFlight,
      msg,
      (peerId, code, payload) => {
        this.opts.sendEthMessage(peerId, code, payload)
      },
    )
    if (result === 'failed') {
      this.catchUp = undefined
      return true
    }
    if (result === 'progress') return true
    void this.finishCatchUpBlock()
    return true
  }

  private async finishCatchUpBlock(): Promise<void> {
    const seq = this.catchUp
    const bundle = seq?.inFlight
    if (seq === undefined || bundle === undefined) return
    await finalizeBlockBundle({
      spine: this.opts.spine,
      stateManager: this.opts.stateManager,
      chain: this.opts.chain,
      hardfork: this.opts.hardfork,
      bundle,
      putServableBlock: (b) => this.opts.putServableBlock(b),
      onBalApplied: this.opts.onBalApplied,
      appendHealBal: this.opts.appendHealBal,
    })
    const fields =
      bundle.headerRlp !== undefined
        ? headFieldsFromHeaderRlp(bundle.headerRlp, this.opts.chain, this.opts.hardfork)
        : null
    if (fields !== null) {
      this.opts.spine.headBlockNumber = fields.number
      this.opts.spine.headStateRoot = fields.stateRoot
      this.opts.spine.currentSlot = Number(fields.number)
    }
    seq.inFlight = undefined
    if (
      this.opts.spine.headBlockNumber !== undefined &&
      this.opts.spine.headBlockNumber < seq.targetHead
    ) {
      void this.tick()
    } else {
      this.catchUp = undefined
    }
  }

  private tick(): void {
    const { spine } = this.opts
    if (spine.phase !== 'HEAD_FOLLOWING' || spine.headBlockNumber === undefined) return
    if (this.catchUp?.inFlight !== undefined) return
    const peer = this.opts.pickEthPeer()
    if (peer?.latestBlock === undefined) return
    const peerHead = BigInt(peer.latestBlock)
    if (peerHead <= spine.headBlockNumber) return
    if (this.catchUp === undefined || this.catchUp.targetHead < peerHead) {
      this.catchUp = {
        peerId: peer.id,
        ethVersion: peer.ethVersion,
        targetHead: peerHead,
      }
    }
    const next = spine.headBlockNumber + 1n
    if (next > this.catchUp.targetHead) return
    this.catchUp.inFlight = startBlockBundleByNumber(
      this.opts.getClient(),
      this.catchUp.peerId,
      this.catchUp.ethVersion,
      next,
    )
  }
}
