import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ChainConfig } from '@ethereumjs/common'
import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'

import {
  EthMessageCodes,
  type ParsedPivotHeader,
  encodeGetBlockAccessListsPayload,
  encodeGetBlockBodiesPayload,
  encodeGetBlockHeadersByNumberPayload,
  encodeGetReceiptsPayload,
  firstHeaderRlpFromBlockHeadersPayload,
  parseFirstBalFromBlockAccessListsPayload,
  parseFirstBodyFromBlockBodiesPayload,
  parsePivotHeaderFromBlockHeadersPayload,
  parseReceiptsReplyPayload,
  peerIdToBytes,
} from '../net/pivotHeader.ts'
import type { EthySpine } from '../spine/types.ts'
import { applyBlockBal, pushBalWindow } from './balSync.ts'

export type BlockBundleStage = 'headers' | 'bodies' | 'receipts' | 'bal'

export type InFlightBlockBundle = {
  peerId: string
  ethVersion: number
  blockNumber: bigint
  hash?: Uint8Array
  headerRlp?: Uint8Array
  bodyRlp?: Uint8Array
  receiptsEth69Rlp?: Uint8Array
  balRlp?: Uint8Array
  stage: BlockBundleStage
  startedAt: number
}

export type PivotHealSequence = {
  peerId: string
  ethVersion: number
  fromBlock: bigint
  toBlock: bigint
  nextBlock: bigint
  targetPivot: ParsedPivotHeader
  /** Header RLP for `toBlock` when the pivot response already returned it. */
  finalHeaderRlp?: Uint8Array
  inFlight?: InFlightBlockBundle
}

export type FinalizeBlockBundleOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  chain: ChainConfig
  hardfork: string
  bundle: InFlightBlockBundle
  putServableBlock: Devp2pWorkerClient['putServableBlock']
}

/** Register servable bundle and apply BAL when present. */
export async function finalizeBlockBundle(opts: FinalizeBlockBundleOpts): Promise<void> {
  const { bundle } = opts
  if (
    bundle.bodyRlp === undefined ||
    bundle.receiptsEth69Rlp === undefined ||
    bundle.hash === undefined ||
    bundle.headerRlp === undefined
  ) {
    return
  }
  opts.putServableBlock({
    number: bundle.blockNumber,
    hash: bundle.hash,
    headerRlp: bundle.headerRlp,
    bodyRlp: bundle.bodyRlp,
    receiptsEth69Rlp: bundle.receiptsEth69Rlp,
    balRlp: bundle.balRlp,
  })
  const applied = await applyBlockBal(
    opts.stateManager,
    bundle.headerRlp,
    bundle.balRlp,
    opts.chain,
    opts.hardfork,
  )
  if (applied.balJson !== undefined) {
    pushBalWindow(opts.spine, bundle.blockNumber, applied.balJson)
  }
}

export function startBlockBundleByNumber(
  client: Devp2pWorkerClient,
  peerId: string,
  ethVersion: number,
  blockNumber: bigint,
): InFlightBlockBundle {
  const payload = encodeGetBlockHeadersByNumberPayload(ethVersion, blockNumber)
  client.sendEthMessage(peerIdToBytes(peerId), EthMessageCodes.GET_BLOCK_HEADERS, payload)
  return {
    peerId,
    ethVersion,
    blockNumber,
    stage: 'headers',
    startedAt: Date.now(),
  }
}

export function advanceBlockBundleEthMessage(
  chain: ChainConfig,
  bundle: InFlightBlockBundle,
  msg: { peerId: string; code: number; payload: Uint8Array },
  sendEth: (peerId: string, code: number, payload: Uint8Array) => void,
): 'progress' | 'complete' | 'failed' {
  if (msg.peerId !== bundle.peerId) return 'failed'
  if (msg.code === EthMessageCodes.BLOCK_HEADERS && bundle.stage === 'headers') {
    const headerRlp = firstHeaderRlpFromBlockHeadersPayload(bundle.ethVersion, msg.payload)
    const parsed = parsePivotHeaderFromBlockHeadersPayload(
      bundle.ethVersion,
      msg.payload,
      undefined,
      chain,
    )
    if (headerRlp === null || parsed === null || parsed.number !== bundle.blockNumber) {
      return 'failed'
    }
    bundle.headerRlp = headerRlp
    bundle.hash = parsed.hash
    bundle.stage = 'bodies'
    bundle.startedAt = Date.now()
    sendEth(
      bundle.peerId,
      EthMessageCodes.GET_BLOCK_BODIES,
      encodeGetBlockBodiesPayload(bundle.ethVersion, parsed.hash),
    )
    return 'progress'
  }
  if (msg.code === EthMessageCodes.BLOCK_BODIES && bundle.stage === 'bodies') {
    const bodyRlp = parseFirstBodyFromBlockBodiesPayload(msg.payload)
    if (bodyRlp === null) return 'failed'
    bundle.bodyRlp = bodyRlp
    bundle.stage = 'receipts'
    bundle.startedAt = Date.now()
    sendEth(
      bundle.peerId,
      EthMessageCodes.GET_RECEIPTS,
      encodeGetReceiptsPayload(bundle.ethVersion, bundle.hash!),
    )
    return 'progress'
  }
  if (msg.code === EthMessageCodes.RECEIPTS && bundle.stage === 'receipts') {
    const parsed = parseReceiptsReplyPayload(bundle.ethVersion, msg.payload)
    if (parsed === null || parsed.lastBlockIncomplete) return 'failed'
    bundle.receiptsEth69Rlp = parsed.receiptsListRlp
    if (bundle.ethVersion >= 71) {
      bundle.stage = 'bal'
      bundle.startedAt = Date.now()
      sendEth(
        bundle.peerId,
        EthMessageCodes.GET_BLOCK_ACCESS_LISTS,
        encodeGetBlockAccessListsPayload(bundle.ethVersion, bundle.hash!),
      )
      return 'progress'
    }
    return 'complete'
  }
  if (msg.code === EthMessageCodes.BLOCK_ACCESS_LISTS && bundle.stage === 'bal') {
    bundle.balRlp = parseFirstBalFromBlockAccessListsPayload(msg.payload)
    return 'complete'
  }
  return 'failed'
}
