import { AddressLike, BNLike, BufferLike } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { AccessListEIP2930TxData, TxData, JsonTx } from '@ethereumjs/tx'
import { Block } from './block'
import { BlockHeader } from './header'

/**
 * An object to set to which blockchain the blocks and their headers belong. This could be specified
 * using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
 * hardfork.
 */
export interface BlockOptions {
  /**
   * A Common object defining the chain and the hardfork a block/block header belongs to.
   *
   * Object will be internally copied so that tx behavior don't incidentally
   * change on future HF changes.
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

  /**
   * If a preceding `BlockHeader` (usually the parent header) is given the preceding
   * header will be used to calculate the difficulty for this block and the calculated
   * difficulty takes precedence over a provided static `difficulty` value.
   */
  calcDifficultyFromHeader?: BlockHeader
  /**
   * A block object by default gets frozen along initialization. This gives you
   * strong additional security guarantees on the consistency of the block parameters.
   *
   * If you need to deactivate the block freeze - e.g. because you want to subclass block and
   * add aditional properties - it is strongly encouraged that you do the freeze yourself
   * within your code instead.
   *
   * Default: true
   */
  freeze?: boolean
  /**
   * Provide a clique signer's privateKey to seal this block.
   * Will throw if provided on a non-PoA chain.
   */
  cliqueSigner?: Buffer
}

/**
 * A block header's data.
 */
export interface HeaderData {
  parentHash?: BufferLike
  uncleHash?: BufferLike
  coinbase?: AddressLike
  stateRoot?: BufferLike
  transactionsTrie?: BufferLike
  receiptTrie?: BufferLike
  bloom?: BufferLike
  difficulty?: BNLike
  number?: BNLike
  gasLimit?: BNLike
  gasUsed?: BNLike
  timestamp?: BNLike
  extraData?: BufferLike
  mixHash?: BufferLike
  nonce?: BufferLike
}

/**
 * A block's data.
 */
export interface BlockData {
  /**
   * Header data for the block
   */
  header?: HeaderData
  transactions?: Array<TxData | AccessListEIP2930TxData>
  uncleHeaders?: Array<HeaderData>
}

export type BlockBuffer = [BlockHeaderBuffer, TransactionsBuffer, UncleHeadersBuffer]
export type BlockHeaderBuffer = Buffer[]
export type BlockBodyBuffer = [TransactionsBuffer, UncleHeadersBuffer]
/**
 * TransactionsBuffer can be an array of serialized txs for Typed Transactions or an array of Buffer Arrays for legacy transactions.
 */
export type TransactionsBuffer = Buffer[][] | Buffer[]
export type UncleHeadersBuffer = Buffer[][]

/**
 * An object with the block's data represented as strings.
 */
export interface JsonBlock {
  /**
   * Header data for the block
   */
  header?: JsonHeader
  transactions?: JsonTx[]
  uncleHeaders?: JsonHeader[]
}

/**
 * An object with the block header's data represented as strings.
 */
export interface JsonHeader {
  parentHash?: string
  uncleHash?: string
  coinbase?: string
  stateRoot?: string
  transactionsTrie?: string
  receiptTrie?: string
  bloom?: string
  difficulty?: string
  number?: string
  gasLimit?: string
  gasUsed?: string
  timestamp?: string
  extraData?: string
  mixHash?: string
  nonce?: string
}

export interface Blockchain {
  getBlock(hash: Buffer): Promise<Block>
}
