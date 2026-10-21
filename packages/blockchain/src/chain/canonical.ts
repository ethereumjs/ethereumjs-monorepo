import { Block, type BlockHeader } from '@ethereumjs/block'
import { BIGINT_0, equalsBytes } from '@ethereumjs/util'

import { DBOp, DBSaveLookups } from '../db/helpers.ts'
import { DBTarget } from '../db/operation.ts'

import {
  type BlockchainHeadState,
  rewindHeadIfEquals,
  rewindIteratorHeadsIfEquals,
} from './heads.ts'

import type { EventEmitter } from 'eventemitter3'
import type { BlockchainEvent } from '../types.ts'

/** DB and head state needed to rewrite canonical number→hash mappings. */
export type CanonicalChainHost = {
  safeNumberToHash(blockNumber: bigint): Promise<Uint8Array | false>
  getBlock(blockNumber: bigint): Promise<Block>
  _getHeader(hash: Uint8Array, number?: bigint): Promise<BlockHeader>
  headState(): BlockchainHeadState
  syncFromHeadState(state: BlockchainHeadState): void
  events: EventEmitter<BlockchainEvent>
  deletedBlocks: Block[]
  DEBUG: boolean
  debug(msg: string): void
}

export async function deleteCanonicalChainReferences(
  host: CanonicalChainHost,
  blockNumber: bigint,
  headHash: Uint8Array,
  ops: DBOp[],
): Promise<void> {
  try {
    let hash: Uint8Array | false

    hash = await host.safeNumberToHash(blockNumber)
    while (hash !== false) {
      ops.push(DBOp.del(DBTarget.NumberToHash, { blockNumber }))

      if (host.events.listenerCount('deletedCanonicalBlocks') > 0) {
        const block = await host.getBlock(blockNumber)
        host.deletedBlocks.push(block)
      }

      const headState = host.headState()
      rewindIteratorHeadsIfEquals(headState, hash, headHash)
      rewindHeadIfEquals(headState, hash, headHash)
      host.syncFromHeadState(headState)

      blockNumber++

      hash = await host.safeNumberToHash(blockNumber)
    }

    host.DEBUG &&
      host.deletedBlocks.length > 0 &&
      host.debug(`deleted ${host.deletedBlocks.length} stale canonical blocks in total`)
  } catch (e) {
    host.deletedBlocks.length = 0
    throw e
  }
}

export async function rebuildCanonical(
  host: CanonicalChainHost,
  header: BlockHeader,
  ops: DBOp[],
): Promise<void> {
  let currentNumber = header.number
  let currentCanonicalHash: Uint8Array = header.hash()

  let staleHash: Uint8Array | false = false
  let staleHeads: string[] = []
  let staleHeadBlock = false

  const headState = host.headState()

  const loopCondition = async () => {
    staleHash = await host.safeNumberToHash(currentNumber)
    currentCanonicalHash = header.hash()
    return staleHash === false || !equalsBytes(currentCanonicalHash, staleHash)
  }

  while (await loopCondition()) {
    const blockHash = header.hash()
    const blockNumber = header.number

    if (blockNumber === BIGINT_0) {
      break
    }

    DBSaveLookups(blockHash, blockNumber).map((op) => {
      ops.push(op)
    })

    for (const name of Object.keys(headState.heads)) {
      if (staleHash && equalsBytes(headState.heads[name], staleHash)) {
        staleHeads.push(name)
      }
    }
    if (
      staleHash &&
      headState.headBlockHash !== undefined &&
      equalsBytes(headState.headBlockHash, staleHash) === true
    ) {
      staleHeadBlock = true
    }

    header = await host._getHeader(header.parentHash, --currentNumber)
    if (header === undefined) {
      staleHeads = []
      break
    }
  }
  for (const name of staleHeads) {
    headState.heads[name] = currentCanonicalHash
  }
  if (staleHeadBlock) {
    headState.headBlockHash = currentCanonicalHash
  }
  host.syncFromHeadState(headState)

  host.DEBUG && host.debug(`stale heads found num=${staleHeads.length}`)
}
