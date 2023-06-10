import type { BlockHeader } from './header'
import type { Common } from '@ethereumjs/common'
import type {
  AccessListEIP2930TxData,
  BlobEIP4844TxData,
  FeeMarketEIP1559TxData,
  JsonRpcTx,
  JsonTx,
  TxData,
} from '@ethereumjs/tx'
import type {
  AddressLike,
  BigIntLike,
  BytesLike,
  JsonRpcWithdrawal,
  WithdrawalBytes,
  WithdrawalData,
} from '@ethereumjs/util'

/**
 * An object to set to which blockchain the blocks and their headers belong. This could be specified
 * using a {@link Common} object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
 * hardfork.
 */
export interface BlockOptions {
  /**
   * A {@link Common} object defining the chain and the hardfork a block/block header belongs to.
   *
   * Object will be internally copied so that tx behavior don't incidentally
   * change on future HF changes.
   *
   * Default: {@link Common} object set to `mainnet` and the HF currently defined as the default
   * hardfork in the {@link Common} class.
   *
   * Current default hardfork: `merge`
   */
  common?: Common
  /**
   * Determine the HF by the block number
   *
   * Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)
   */
  hardforkByBlockNumber?: boolean
  /**
   * Determine the HF by total difficulty (Merge HF)
   *
   * This option is a superset of `hardforkByBlockNumber` (so only use one of both options)
   * and determines the HF by both the block number and the TD.
   *
   * Since the TTD is only a threshold the block number will in doubt take precedence (imagine
   * e.g. both Merge and Shanghai HF blocks set and the block number from the block provided
   * pointing to a Shanghai block: this will lead to set the HF as Shanghai and not the Merge).
   */
  hardforkByTTD?: BigIntLike
  /**
   * If a preceding {@link BlockHeader} (usually the parent header) is given the preceding
   * header will be used to calculate the difficulty for this block and the calculated
   * difficulty takes precedence over a provided static `difficulty` value.
   *
   * Note that this option has no effect on networks other than PoW/Ethash networks
   * (respectively also deactivates on the Merge HF switching to PoS/Casper).
   */
  calcDifficultyFromHeader?: BlockHeader
  /**
   * A block object by default gets frozen along initialization. This gives you
   * strong additional security guarantees on the consistency of the block parameters.
   * It also enables block hash caching when the `hash()` method is called multiple times.
   *
   * If you need to deactivate the block freeze - e.g. because you want to subclass block and
   * add additional properties - it is strongly encouraged that you do the freeze yourself
   * within your code instead.
   *
   * Default: true
   */
  freeze?: boolean
  /**
   * Provide a clique signer's privateKey to seal this block.
   * Will throw if provided on a non-PoA chain.
   */
  cliqueSigner?: Uint8Array
  /**
   *  Skip consensus format validation checks on header if set. Defaults to false.
   */
  skipConsensusFormatValidation?: boolean
}

/**
 * A block header's data.
 */
export interface HeaderData {
  parentHash?: BytesLike
  uncleHash?: BytesLike
  coinbase?: AddressLike
  stateRoot?: BytesLike
  transactionsTrie?: BytesLike
  receiptTrie?: BytesLike
  logsBloom?: BytesLike
  difficulty?: BigIntLike
  number?: BigIntLike
  gasLimit?: BigIntLike
  gasUsed?: BigIntLike
  timestamp?: BigIntLike
  extraData?: BytesLike
  mixHash?: BytesLike
  nonce?: BytesLike
  baseFeePerGas?: BigIntLike
  withdrawalsRoot?: BytesLike
  dataGasUsed?: BigIntLike
  excessDataGas?: BigIntLike
}

/**
 * A block's data.
 */
export interface BlockData {
  /**
   * Header data for the block
   */
  header?: HeaderData
  transactions?: Array<
    TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData | BlobEIP4844TxData
  >
  uncleHeaders?: Array<HeaderData>
  withdrawals?: Array<WithdrawalData>
}

export type WithdrawalsBytes = WithdrawalBytes[]

export type BlockBytes =
  | [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes]
  | [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes]
export type BlockHeaderBytes = Uint8Array[]
export type BlockBodyBytes = [TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes?]
/**
 * TransactionsBytes can be an array of serialized txs for Typed Transactions or an array of Uint8Array Arrays for legacy transactions.
 */
export type TransactionsBytes = Uint8Array[][] | Uint8Array[]
export type UncleHeadersBytes = Uint8Array[][]

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
  withdrawals?: JsonRpcWithdrawal[]
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
  logsBloom?: string
  difficulty?: string
  number?: string
  gasLimit?: string
  gasUsed?: string
  timestamp?: string
  extraData?: string
  mixHash?: string
  nonce?: string
  baseFeePerGas?: string
  withdrawalsRoot?: string
  dataGasUsed?: string
  excessDataGas?: string
}

/*
 * Based on https://ethereum.org/en/developers/docs/apis/json-rpc/
 */
export interface JsonRpcBlock {
  number: string // the block number. null when pending block.
  hash: string // hash of the block. null when pending block.
  parentHash: string // hash of the parent block.
  mixHash?: string // bit hash which proves combined with the nonce that a sufficient amount of computation has been carried out on this block.
  nonce: string // hash of the generated proof-of-work. null when pending block.
  sha3Uncles: string // SHA3 of the uncles data in the block.
  logsBloom: string // the bloom filter for the logs of the block. null when pending block.
  transactionsRoot: string // the root of the transaction trie of the block.
  stateRoot: string // the root of the final state trie of the block.
  receiptsRoot: string // the root of the receipts trie of the block.
  miner: string // the address of the beneficiary to whom the mining rewards were given.
  difficulty: string // integer of the difficulty for this block.
  totalDifficulty: string // integer of the total difficulty of the chain until this block.
  extraData: string // the “extra data” field of this block.
  size: string // integer the size of this block in bytes.
  gasLimit: string // the maximum gas allowed in this block.
  gasUsed: string // the total used gas by all transactions in this block.
  timestamp: string // the unix timestamp for when the block was collated.
  transactions: Array<JsonRpcTx | string> // Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  uncles: string[] // Array of uncle hashes
  baseFeePerGas?: string // If EIP-1559 is enabled for this block, returns the base fee per gas
  withdrawals?: Array<JsonRpcWithdrawal> // If EIP-4895 is enabled for this block, array of withdrawals
  withdrawalsRoot?: string // If EIP-4895 is enabled for this block, the root of the withdrawal trie of the block.
  dataGasUsed?: string // If EIP-4844 is enabled for this block, returns the data gas used for the block
  excessDataGas?: string // If EIP-4844 is enabled for this block, returns the excess data gas for the block
}

export type WithdrawalV1 = {
  index: string // Quantity, 8 Bytes
  validatorIndex: string // Quantity, 8 bytes
  address: string // DATA, 20 bytes
  amount: string // Quantity, 32 bytes
}

export type ExecutionPayload = {
  parentHash: string // DATA, 32 Bytes
  feeRecipient: string // DATA, 20 Bytes
  stateRoot: string // DATA, 32 Bytes
  receiptsRoot: string // DATA, 32 bytes
  logsBloom: string // DATA, 256 Bytes
  prevRandao: string // DATA, 32 Bytes
  blockNumber: string // QUANTITY, 64 Bits
  gasLimit: string // QUANTITY, 64 Bits
  gasUsed: string // QUANTITY, 64 Bits
  timestamp: string // QUANTITY, 64 Bits
  extraData: string // DATA, 0 to 32 Bytes
  baseFeePerGas: string // QUANTITY, 256 Bits
  blockHash: string // DATA, 32 Bytes
  transactions: string[] // Array of DATA - Array of transaction rlp strings,
  withdrawals?: WithdrawalV1[] // Array of withdrawal objects
  dataGasUsed?: string // QUANTITY, 64 Bits
  excessDataGas?: string // QUANTITY, 64 Bits
}
