import { Block, BlockHeader } from '@ethereumjs/block'
import { ConsensusType } from '@ethereumjs/common'
import {
  BIGINT_0,
  BIGINT_1,
  EthereumJSErrorWithoutCode,
  bytesToHex,
  equalsBytes,
} from '@ethereumjs/util'

import { DBOp, DBSetBlockOrHeader, DBSetHashToNumber, DBSetTD } from '../db/helpers.ts'

import { deleteCanonicalChainReferences, rebuildCanonical } from './canonical.ts'
import { type BlockchainHeadState, noteCanonicalPut, noteSideChainBody } from './heads.ts'

import type { Block as BlockType } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type { Consensus } from '../types.ts'

export type PutBlockHost = {
  runWithLock<T>(action: () => Promise<T>): Promise<T>
  genesisBlock: BlockType
  common: Common
  validateBlocks: boolean
  validateConsensus: boolean
  consensus: Consensus | undefined
  hardforkByHeadBlockNumber: boolean
  deletedBlocks: Block[]
  events: { emit(event: 'deletedCanonicalBlocks', blocks: Block[]): void }
  DEBUG: boolean
  debug(msg: string): void
  validateBlock(block: Block): Promise<void>
  getTotalDifficulty(hash: Uint8Array): Promise<bigint>
  getParentTD(header: BlockHeader): Promise<bigint>
  findCommonAncestor(header: BlockHeader): Promise<{
    commonAncestor: BlockHeader
    ancestorHeaders: BlockHeader[]
  }>
  checkAndTransitionHardForkByNumber(blockNumber: bigint, timestamp: bigint): Promise<void>
  saveHeadOps(): DBOp[]
  dbBatch(ops: DBOp[]): Promise<void>
  headState(): BlockchainHeadState
  syncFromHeadState(state: BlockchainHeadState): void
  canonicalHost(): import('./canonical.ts').CanonicalChainHost
  restoreHeads(
    heads: Record<string, Uint8Array>,
    headHeaderHash?: Uint8Array,
    headBlockHash?: Uint8Array,
  ): void
  snapshotHeads(): {
    heads: Record<string, Uint8Array>
    headHeaderHash?: Uint8Array
    headBlockHash?: Uint8Array
  }
}

export async function putBlockOrHeader(
  host: PutBlockHost,
  item: Block | BlockHeader,
): Promise<void> {
  await host.runWithLock<void>(async () => {
    const {
      heads: oldHeads,
      headHeaderHash: oldHeadHeaderHash,
      headBlockHash: oldHeadBlockHash,
    } = host.snapshotHeads()
    try {
      const block =
        item instanceof BlockHeader
          ? new Block(item, undefined, undefined, undefined, { common: item.common })
          : item
      const isGenesis = block.isGenesis()

      if (isGenesis) {
        if (equalsBytes(host.genesisBlock.hash(), block.hash())) {
          return
        }
        throw EthereumJSErrorWithoutCode(
          'Cannot put a different genesis block than current blockchain genesis: create a new Blockchain',
        )
      }

      const { header } = block
      const blockHash = header.hash()
      const blockNumber = header.number
      let td = header.difficulty
      const currentTd = { header: BIGINT_0, block: BIGINT_0 }
      let dbOps: DBOp[] = []

      if (block.common.chainId() !== host.common.chainId()) {
        throw EthereumJSErrorWithoutCode(
          `Chain mismatch while trying to put block or header. Chain ID of block: ${block.common.chainId}, chain ID of blockchain : ${host.common.chainId}`,
        )
      }

      if (host.validateBlocks && !isGenesis && item instanceof Block) {
        await host.validateBlock(block)
      }

      if (host.validateConsensus) {
        await host.consensus!.validateConsensus(block)
      }

      const headsBeforePut = host.headState()
      if (headsBeforePut.headHeaderHash) {
        currentTd.header = await host.getTotalDifficulty(headsBeforePut.headHeaderHash)
      }
      if (headsBeforePut.headBlockHash) {
        currentTd.block = await host.getTotalDifficulty(headsBeforePut.headBlockHash)
      }

      const parentTd = await host.getParentTD(header)
      if (!block.isGenesis()) {
        td += parentTd
      }

      dbOps = dbOps.concat(DBSetTD(td, blockNumber, blockHash))
      dbOps = dbOps.concat(DBSetBlockOrHeader(item))

      let commonAncestor: undefined | BlockHeader
      let ancestorHeaders: undefined | BlockHeader[]
      if (
        block.isGenesis() ||
        td > currentTd.header ||
        block.common.consensusType() === ConsensusType.ProofOfStake
      ) {
        const foundCommon = await host.findCommonAncestor(header)
        commonAncestor = foundCommon.commonAncestor
        ancestorHeaders = foundCommon.ancestorHeaders

        const headState = host.headState()
        noteCanonicalPut(headState, blockHash, item instanceof Block)
        host.syncFromHeadState(headState)
        if (host.hardforkByHeadBlockNumber) {
          await host.checkAndTransitionHardForkByNumber(blockNumber, header.timestamp)
        }

        const canonical = host.canonicalHost()
        await deleteCanonicalChainReferences(canonical, blockNumber + BIGINT_1, blockHash, dbOps)
        await rebuildCanonical(canonical, header, dbOps)
      } else {
        if (td > currentTd.block && item instanceof Block) {
          const headState = host.headState()
          noteSideChainBody(headState, blockHash)
          host.syncFromHeadState(headState)
        }
        dbOps.push(DBSetHashToNumber(blockHash, blockNumber))
      }

      const ops = dbOps.concat(host.saveHeadOps())
      await host.dbBatch(ops)

      await host.consensus?.newBlock(block, commonAncestor, ancestorHeaders)
      host.DEBUG &&
        host.debug(`put block number=${block.header.number} hash=${bytesToHex(blockHash)}`)
    } catch (e) {
      host.restoreHeads(oldHeads, oldHeadHeaderHash, oldHeadBlockHash)
      throw e
    }
  })
  if (host.deletedBlocks.length > 0) {
    host.events.emit('deletedCanonicalBlocks', host.deletedBlocks)
    for (const block of host.deletedBlocks)
      host.DEBUG &&
        host.debug(
          `delete stale canonical block number=${block.header.number} hash=${bytesToHex(block.hash())}`,
        )
    host.deletedBlocks.length = 0
  }
}
