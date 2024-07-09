import type { BlockHeader } from './header.js'
import type { Common } from '@ethereumjs/common'
import type { JsonRpcTx, JsonTx, TransactionType, TxData } from '@ethereumjs/tx'
import type {
  AddressLike,
  BigIntLike,
  BytesLike,
  CLRequest,
  CLRequestType,
  ConsolidationRequestV1,
  DepositRequestV1,
  JsonRpcWithdrawal,
  PrefixedHexString,
  RequestBytes,
  VerkleExecutionWitness,
  WithdrawalBytes,
  WithdrawalData,
  WithdrawalRequestV1,
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
   * Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
   * for older Hfs.
   *
   * Additionally it is possible to pass in a specific TD value to support live-Merge-HF
   * transitions. Note that this should only be needed in very rare and specific scenarios.
   *
   * Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)
   */
  setHardfork?: boolean | BigIntLike
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

  executionWitness?: VerkleExecutionWitness
}

/**
 * A block header's data.
 */
// TODO: Deprecate the string type and only keep BytesLike/AddressLike/BigIntLike
export interface HeaderData {
  parentHash?: BytesLike | string
  uncleHash?: BytesLike | string
  coinbase?: AddressLike | string
  stateRoot?: BytesLike | string
  transactionsTrie?: BytesLike | string
  receiptTrie?: BytesLike | string
  logsBloom?: BytesLike | string
  difficulty?: BigIntLike | string
  number?: BigIntLike | string
  gasLimit?: BigIntLike | string
  gasUsed?: BigIntLike | string
  timestamp?: BigIntLike | string
  extraData?: BytesLike | string
  mixHash?: BytesLike | string
  nonce?: BytesLike | string
  baseFeePerGas?: BigIntLike | string
  withdrawalsRoot?: BytesLike | string
  blobGasUsed?: BigIntLike | string
  excessBlobGas?: BigIntLike | string
  parentBeaconBlockRoot?: BytesLike | string
  requestsRoot?: BytesLike | string
}

/**
 * A block's data.
 */
export interface BlockData {
  /**
   * Header data for the block
   */
  header?: HeaderData
  transactions?: Array<TxData[TransactionType]>
  uncleHeaders?: Array<HeaderData>
  withdrawals?: Array<WithdrawalData>
  requests?: Array<CLRequest<CLRequestType>>
  /**
   * EIP-6800: Verkle Proof Data (experimental)
   */
  executionWitness?: VerkleExecutionWitness | null
}

export type WithdrawalsBytes = WithdrawalBytes[]
export type RequestsBytes = RequestBytes[]
export type ExecutionWitnessBytes = Uint8Array

export type BlockBytes =
  | [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes]
  | [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes]
  | [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes, RequestsBytes]
  | [
      BlockHeaderBytes,
      TransactionsBytes,
      UncleHeadersBytes,
      WithdrawalsBytes,
      RequestsBytes,
      ExecutionWitnessBytes
    ]

/**
 * BlockHeaderBuffer is a Buffer array, except for the Verkle PreState which is an array of prestate arrays.
 */
export type BlockHeaderBytes = Uint8Array[]
export type BlockBodyBytes = [
  TransactionsBytes,
  UncleHeadersBytes,
  WithdrawalsBytes?,
  RequestBytes?
]
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
  requests?: PrefixedHexString[] | null
  executionWitness?: VerkleExecutionWitness | null
}

/**
 * An object with the block header's data represented as 0x-prefixed hex strings.
 */
// TODO: Remove the string type and only keep PrefixedHexString
export interface JsonHeader {
  parentHash?: PrefixedHexString | string
  uncleHash?: PrefixedHexString | string
  coinbase?: PrefixedHexString | string
  stateRoot?: PrefixedHexString | string
  transactionsTrie?: PrefixedHexString | string
  receiptTrie?: PrefixedHexString | string
  logsBloom?: PrefixedHexString | string
  difficulty?: PrefixedHexString | string
  number?: PrefixedHexString | string
  gasLimit?: PrefixedHexString | string
  gasUsed?: PrefixedHexString | string
  timestamp?: PrefixedHexString | string
  extraData?: PrefixedHexString | string
  mixHash?: PrefixedHexString | string
  nonce?: PrefixedHexString | string
  baseFeePerGas?: PrefixedHexString | string
  withdrawalsRoot?: PrefixedHexString | string
  blobGasUsed?: PrefixedHexString | string
  excessBlobGas?: PrefixedHexString | string
  parentBeaconBlockRoot?: PrefixedHexString | string
  requestsRoot?: PrefixedHexString | string
}

/*
 * Based on https://ethereum.org/en/developers/docs/apis/json-rpc/
 */
// TODO: Remove the string type and only keep PrefixedHexString
export interface JsonRpcBlock {
  number: PrefixedHexString | string // the block number. null when pending block.
  hash: PrefixedHexString | string // hash of the block. null when pending block.
  parentHash: PrefixedHexString | string // hash of the parent block.
  mixHash?: PrefixedHexString | string // bit hash which proves combined with the nonce that a sufficient amount of computation has been carried out on this block.
  nonce: PrefixedHexString | string // hash of the generated proof-of-work. null when pending block.
  sha3Uncles: PrefixedHexString | string // SHA3 of the uncles data in the block.
  logsBloom: PrefixedHexString | string // the bloom filter for the logs of the block. null when pending block.
  transactionsRoot: PrefixedHexString | string // the root of the transaction trie of the block.
  stateRoot: PrefixedHexString | string // the root of the final state trie of the block.
  receiptsRoot: PrefixedHexString | string // the root of the receipts trie of the block.
  miner: PrefixedHexString | string // the address of the beneficiary to whom the mining rewards were given.
  difficulty: PrefixedHexString | string // integer of the difficulty for this block.
  totalDifficulty: PrefixedHexString | string // integer of the total difficulty of the chain until this block.
  extraData: PrefixedHexString | string // the “extra data” field of this block.
  size: PrefixedHexString | string // integer the size of this block in bytes.
  gasLimit: PrefixedHexString | string // the maximum gas allowed in this block.
  gasUsed: PrefixedHexString | string // the total used gas by all transactions in this block.
  timestamp: PrefixedHexString | string // the unix timestamp for when the block was collated.
  transactions: Array<JsonRpcTx | PrefixedHexString | string> // Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  uncles: PrefixedHexString[] | string[] // Array of uncle hashes
  baseFeePerGas?: PrefixedHexString | string // If EIP-1559 is enabled for this block, returns the base fee per gas
  withdrawals?: Array<JsonRpcWithdrawal> // If EIP-4895 is enabled for this block, array of withdrawals
  withdrawalsRoot?: PrefixedHexString | string // If EIP-4895 is enabled for this block, the root of the withdrawal trie of the block.
  blobGasUsed?: PrefixedHexString | string // If EIP-4844 is enabled for this block, returns the blob gas used for the block
  excessBlobGas?: PrefixedHexString | string // If EIP-4844 is enabled for this block, returns the excess blob gas for the block
  parentBeaconBlockRoot?: PrefixedHexString | string // If EIP-4788 is enabled for this block, returns parent beacon block root
  executionWitness?: VerkleExecutionWitness | null // If Verkle is enabled for this block
  requestsRoot?: PrefixedHexString | string // If EIP-7685 is enabled for this block, returns the requests root
  requests?: Array<PrefixedHexString | string> // If EIP-7685 is enabled for this block, array of serialized CL requests
}

export type WithdrawalV1 = {
  index: PrefixedHexString // Quantity, 8 Bytes
  validatorIndex: PrefixedHexString // Quantity, 8 bytes
  address: PrefixedHexString // DATA, 20 bytes
  amount: PrefixedHexString // Quantity, 32 bytes
}

// Note: all these strings are 0x-prefixed
// TODO: Remove the string type and only keep PrefixedHexString
export type ExecutionPayload = {
  parentHash: PrefixedHexString | string // DATA, 32 Bytes
  feeRecipient: PrefixedHexString | string // DATA, 20 Bytes
  stateRoot: PrefixedHexString | string // DATA, 32 Bytes
  receiptsRoot: PrefixedHexString | string // DATA, 32 bytes
  logsBloom: PrefixedHexString | string // DATA, 256 Bytes
  prevRandao: PrefixedHexString | string // DATA, 32 Bytes
  blockNumber: PrefixedHexString | string // QUANTITY, 64 Bits
  gasLimit: PrefixedHexString | string // QUANTITY, 64 Bits
  gasUsed: PrefixedHexString | string // QUANTITY, 64 Bits
  timestamp: PrefixedHexString | string // QUANTITY, 64 Bits
  extraData: PrefixedHexString | string // DATA, 0 to 32 Bytes
  baseFeePerGas: PrefixedHexString | string // QUANTITY, 256 Bits
  blockHash: PrefixedHexString | string // DATA, 32 Bytes
  transactions: PrefixedHexString[] | string[] // Array of DATA - Array of transaction rlp strings,
  withdrawals?: WithdrawalV1[] // Array of withdrawal objects
  blobGasUsed?: PrefixedHexString | string // QUANTITY, 64 Bits
  excessBlobGas?: PrefixedHexString | string // QUANTITY, 64 Bits
  parentBeaconBlockRoot?: PrefixedHexString | string // QUANTITY, 64 Bits
  // VerkleExecutionWitness is already a hex serialized object
  executionWitness?: VerkleExecutionWitness | null // QUANTITY, 64 Bits, null implies not available
  depositRequests?: DepositRequestV1[] // Array of 6110 deposit requests
  withdrawalRequests?: WithdrawalRequestV1[] // Array of 7002 withdrawal requests
  consolidationRequests?: ConsolidationRequestV1[] // Array of 7251 consolidation requests
}
