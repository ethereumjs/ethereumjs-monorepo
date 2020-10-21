import { BN } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'

export type BlockIdentifier = BN | Buffer // either a Block number or a BlockHash

export interface BlockchainDB {
  putTD(blockIdentifier: BlockIdentifier): Promise<void>
  getTD(blockIdentifier: BlockIdentifier): Promise<BN>

  putBlock(block: Block): Promise<void>
  getBlock(blockIdentifier: BlockIdentifier): Promise<Block>

  putBlockHeader(header: BlockHeader): Promise<void>
  getBlockHeader(blockIdentifier: BlockIdentifier): Promise<BlockHeader>

  getNumberByHash(hash: Buffer): Promise<BN>
  getHashByNumber(number: BN): Promise<Buffer>
}
