import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'

import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import {
  EthMessageCodes,
  type ParsedPivotHeader,
  encodeGetBlockAccessListsPayload,
  encodeGetBlockBodiesPayload,
  encodeGetBlockHeadersByNumberPayload,
  encodeGetReceiptsPayload,
  ethReplyRequestId,
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
  headerRequestId?: number
  bodiesRequestId?: number
  receiptsRequestId?: number
  balRequestId?: number
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
  onBalApplied?: (balJson: BALJSONBlockAccessList) => void
  appendHealBal?: (blockNumber: bigint, balRlp: Uint8Array) => void
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
  if (bundle.balRlp !== undefined && bundle.balRlp.length > 0) {
    opts.appendHealBal?.(bundle.blockNumber, bundle.balRlp)
  }
  const applied = await applyBlockBal(
    opts.stateManager,
    bundle.headerRlp,
    bundle.balRlp,
    opts.chain,
    opts.hardfork,
  )
  if (applied.balJson !== undefined) {
    pushBalWindow(opts.spine, bundle.blockNumber, applied.balJson)
    opts.onBalApplied?.(applied.balJson)
  }
}

export function headFieldsFromHeaderRlp(
  headerRlp: Uint8Array,
  chain: ChainConfig,
  hardfork: string,
): { number: bigint; stateRoot: Uint8Array } | null {
  const common = new Common({ chain, hardfork })
  try {
    const raw = RLP.decode(headerRlp) as never
    const header = createBlockHeaderFromBytesArray(raw, {
      common,
      skipConsensusFormatValidation: true,
    })
    return { number: header.number, stateRoot: header.stateRoot }
  } catch {
    return null
  }
}

export function startBlockBundleByNumber(
  client: Devp2pWorkerClient,
  peerId: string,
  ethVersion: number,
  blockNumber: bigint,
  headerRequestId = 1,
): InFlightBlockBundle {
  const payload = encodeGetBlockHeadersByNumberPayload(ethVersion, blockNumber, headerRequestId)
  client.sendEthMessage(peerIdToBytes(peerId), EthMessageCodes.GET_BLOCK_HEADERS, payload)
  return {
    peerId,
    ethVersion,
    blockNumber,
    stage: 'headers',
    startedAt: Date.now(),
    headerRequestId,
  }
}

function requestIdMatches(
  ethVersion: number,
  payload: Uint8Array,
  expected: number | undefined,
): boolean {
  if (expected === undefined) return true
  const got = ethReplyRequestId(ethVersion, payload)
  return got === expected
}

export function advanceBlockBundleEthMessage(
  chain: ChainConfig,
  bundle: InFlightBlockBundle,
  msg: { peerId: string; code: number; payload: Uint8Array },
  sendEth: (peerId: string, code: number, payload: Uint8Array) => void,
): 'progress' | 'complete' | 'failed' | 'ignore' {
  if (msg.peerId !== bundle.peerId) return 'ignore'
  if (msg.code === EthMessageCodes.BLOCK_HEADERS && bundle.stage === 'headers') {
    if (!requestIdMatches(bundle.ethVersion, msg.payload, bundle.headerRequestId)) {
      return 'ignore'
    }
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
    const bodiesRequestId = 2
    bundle.bodiesRequestId = bodiesRequestId
    sendEth(
      bundle.peerId,
      EthMessageCodes.GET_BLOCK_BODIES,
      encodeGetBlockBodiesPayload(bundle.ethVersion, parsed.hash, bodiesRequestId),
    )
    return 'progress'
  }
  if (msg.code === EthMessageCodes.BLOCK_BODIES && bundle.stage === 'bodies') {
    if (!requestIdMatches(bundle.ethVersion, msg.payload, bundle.bodiesRequestId)) {
      return 'ignore'
    }
    const bodyRlp = parseFirstBodyFromBlockBodiesPayload(msg.payload)
    if (bodyRlp === null) return 'failed'
    bundle.bodyRlp = bodyRlp
    bundle.stage = 'receipts'
    bundle.startedAt = Date.now()
    const receiptsRequestId = 3
    bundle.receiptsRequestId = receiptsRequestId
    sendEth(
      bundle.peerId,
      EthMessageCodes.GET_RECEIPTS,
      encodeGetReceiptsPayload(bundle.ethVersion, bundle.hash!, receiptsRequestId),
    )
    return 'progress'
  }
  if (msg.code === EthMessageCodes.RECEIPTS && bundle.stage === 'receipts') {
    if (!requestIdMatches(bundle.ethVersion, msg.payload, bundle.receiptsRequestId)) {
      return 'ignore'
    }
    const parsed = parseReceiptsReplyPayload(bundle.ethVersion, msg.payload)
    if (parsed === null || parsed.lastBlockIncomplete) return 'failed'
    bundle.receiptsEth69Rlp = parsed.receiptsListRlp
    if (bundle.ethVersion >= 71) {
      bundle.stage = 'bal'
      bundle.startedAt = Date.now()
      const balRequestId = 4
      bundle.balRequestId = balRequestId
      sendEth(
        bundle.peerId,
        EthMessageCodes.GET_BLOCK_ACCESS_LISTS,
        encodeGetBlockAccessListsPayload(bundle.ethVersion, bundle.hash!, balRequestId),
      )
      return 'progress'
    }
    return 'complete'
  }
  if (msg.code === EthMessageCodes.BLOCK_ACCESS_LISTS && bundle.stage === 'bal') {
    if (!requestIdMatches(bundle.ethVersion, msg.payload, bundle.balRequestId)) {
      return 'ignore'
    }
    bundle.balRlp = parseFirstBalFromBlockAccessListsPayload(msg.payload)
    return 'complete'
  }
  return 'ignore'
}
