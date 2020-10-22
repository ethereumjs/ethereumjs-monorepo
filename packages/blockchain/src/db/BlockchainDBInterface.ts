import { BN } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'

export type BlockIdentifier = BN | Buffer // either a Block number or a BlockHash

export interface BlockchainDB {
  // put a total difficulty for a given Block Hash (a block by block hash always has the same total difficulty)
  putTD(blockHash: Buffer): Promise<void>
  getTD(blockHash: BlockIdentifier): Promise<BN>

  // put block. this should also put the block header in the database.
  putBlock(block: Block): Promise<void>
  // return a block either by the block hash or take x-th block from the canonical chain
  getBlock(blockIdentifier: BlockIdentifier): Promise<Block>

  putBlockHeader(header: BlockHeader): Promise<void>
  // return a block header by the block hash or take the x-th block from the canonical chain
  getBlockHeader(blockIdentifier: BlockIdentifier): Promise<BlockHeader>

  // return the block number given a hash
  getNumberByHash(hash: Buffer): Promise<BN>
  // return the hash given by a block number (this returns the current block hash in the canonical chain)
  getHashByNumber(number: BN): Promise<Buffer>
}
