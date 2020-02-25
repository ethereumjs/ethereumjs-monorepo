import Common from 'ethereumjs-common'
import { TxData } from 'ethereumjs-tx'
import { Block } from './block'

/**
 * An object to set to which blockchain the blocks and their headers belong. This could be specified
 * using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
 * hardfork.
 */
export interface ChainOptions {
  /**
   * A Common object defining the chain and the hardfork a block/block header belongs to.
   */
  common?: Common

  /**
   * The chain of the block/block header, default: 'mainnet'
   */
  chain?: number | string

  /**
   * The hardfork of the block/block header, default: 'petersburg'
   */
  hardfork?: string
}

/**
 * Any object that can be transformed into a `Buffer`
 */
export interface TransformableToBuffer {
  toBuffer(): Buffer
}

/**
 * A hex string prefixed with `0x`.
 */
export type PrefixedHexString = string

/**
 * A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.
 */
export type BufferLike = Buffer | TransformableToBuffer | PrefixedHexString | number

/**
 * A block header's data.
 */
export interface BlockHeaderData {
  parentHash?: BufferLike
  uncleHash?: BufferLike
  coinbase?: BufferLike
  stateRoot?: BufferLike
  transactionsTrie?: BufferLike
  receiptTrie?: BufferLike
  bloom?: BufferLike
  difficulty?: BufferLike
  number?: BufferLike
  gasLimit?: BufferLike
  gasUsed?: BufferLike
  timestamp?: BufferLike
  extraData?: BufferLike
  mixHash?: BufferLike
  nonce?: BufferLike
}

/**
 * A block's data.
 */
export interface BlockData {
  header?: Buffer | PrefixedHexString | BufferLike[] | BlockHeaderData
  transactions?: Array<Buffer | PrefixedHexString | BufferLike[] | TxData>
  uncleHeaders?: Array<Buffer | PrefixedHexString | BufferLike[] | BlockHeaderData>
}

export interface Blockchain {
  getBlock(hash: Buffer, callback: (err: Error | null, block?: Block) => void): void
}
