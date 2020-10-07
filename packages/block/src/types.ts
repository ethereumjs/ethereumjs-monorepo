import Common from '@ethereumjs/common'
import { TxData } from '@ethereumjs/tx'
import { Block } from './block'

/**
 * An object to set to which blockchain the blocks and their headers belong. This could be specified
 * using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
 * hardfork.
 */
export interface BlockOptions {
  /**
   * A Common object defining the chain and the hardfork a block/block header belongs to.
   *
   * Default: `Common` object set to `mainnet` and the HF currently defined as the default
   * hardfork in the `Common` class.
   *
   * Current default hardfork: `istanbul`
   */
  common?: Common
  /**
   * Determine the HF by the block number
   *
   * Default: `false` (HF is set to whatever default HF is set by the Common instance)
   */
  hardforkByBlockNumber?: boolean
  /**
   * Turns the block header into the canonical genesis block header
   *
   * If set to `true` all other header data is ignored.
   *
   * If a Common instance is passed the instance need to be set to `chainstart` as a HF,
   * otherwise usage of this option will throw
   *
   * Default: `false`
   */
  initWithGenesisHeader?: boolean
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
  getBlock(hash: Buffer): Promise<Block>
}
