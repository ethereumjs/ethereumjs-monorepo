import type { Bloom } from './bloom/index.ts'
import type { Block, BlockOptions, HeaderData } from '@ethereumjs/block'
import type { Common, ParamsDict, StateManagerInterface } from '@ethereumjs/common'
import type {
  EVMInterface,
  EVMMockBlockchainInterface,
  EVMOpts,
  EVMResult,
  Log,
} from '@ethereumjs/evm'
import type { AccessList, TypedTransaction } from '@ethereumjs/tx'
import type {
  BigIntLike,
  CLRequest,
  CLRequestType,
  PrefixedHexString,
  WithdrawalData,
} from '@ethereumjs/util'
export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt | EIP4844BlobTxReceipt

/**
 * Abstract interface with common transaction receipt fields
 */
export interface BaseTxReceipt {
  /**
   * Cumulative gas used in the block including this tx
   */
  cumulativeBlockGasUsed: bigint
  /**
   * Bloom bitvector
   */
  bitvector: Uint8Array
  /**
   * Logs emitted
   */
  logs: Log[]
}

/**
 * Pre-Byzantium receipt type with a field
 * for the intermediary state root
 */
export interface PreByzantiumTxReceipt extends BaseTxReceipt {
  /**
   * Intermediary state root
   */
  stateRoot: Uint8Array
}

/**
 * Receipt type for Byzantium and beyond replacing the intermediary
 * state root field with a status code field (EIP-658)
 */
export interface PostByzantiumTxReceipt extends BaseTxReceipt {
  /**
   * Status of transaction, `1` if successful, `0` if an exception occurred
   */
  status: 0 | 1
}

export interface EIP4844BlobTxReceipt extends PostByzantiumTxReceipt {
  /**
   * blob gas consumed by a transaction
   *
   * Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
   * and is only provided as part of receipt metadata.
   */
  blobGasUsed: bigint
  /**
   * blob gas price for block transaction was included in
   *
   * Note: This values is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
   * and is only provided as part of receipt metadata.
   */
  blobGasPrice: bigint
}

export type EVMProfilerOpts = {
  enabled: boolean
  // extra options here (such as use X hardfork for gas)
}

export type VMEvent = {
  beforeBlock: (data: Block, resolve?: (result?: any) => void) => void
  afterBlock: (data: AfterBlockEvent, resolve?: (result?: any) => void) => void
  beforeTx: (data: TypedTransaction, resolve?: (result?: any) => void) => void
  afterTx: (data: AfterTxEvent, resolve?: (result?: any) => void) => void
}

export type VMProfilerOpts = {
  //evmProfilerOpts: EVMProfilerOpts
  reportAfterTx?: boolean
  reportAfterBlock?: boolean
}

/**
 * Options for instantiating a {@link VM}.
 */
export interface VMOpts {
  /**
   * Use a {@link Common} instance
   * if you want to change the chain setup.
   *
   * ### Possible Values
   *
   * - `chain`: all chains supported by `Common` or a custom chain
   * - `hardfork`: `mainnet` hardforks up to the `Paris` hardfork
   * - `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)
   *
   * Note: check the associated `@ethereumjs/evm` instance options
   * documentation for supported EIPs.
   *
   * ### Default Setup
   *
   * Default setup if no `Common` instance is provided:
   *
   * - `chain`: `mainnet`
   * - `hardfork`: `paris`
   * - `eips`: `[]`
   */
  common?: Common
  /**
   * A {@link StateManager} instance to use as the state store
   */
  stateManager?: StateManagerInterface
  /**
   * A {@link Blockchain} object for storing/retrieving blocks
   */
  blockchain?: EVMMockBlockchainInterface
  /**
   * If true, create entries in the state tree for the precompiled contracts, saving some gas the
   * first time each of them is called.
   *
   * If this parameter is false, each call to each of them has to pay an extra 25000 gas
   * for creating the account. If the account is still empty after this call, it will be deleted,
   * such that this extra cost has to be paid again.
   *
   * Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
   * the very first call, which is intended for testing networks.
   *
   * Default: `false`
   */
  activatePrecompiles?: boolean

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
   * VM parameters sorted by EIP can be found in the exported `paramsVM` dictionary,
   * which is internally passed to the associated `@ethereumjs/common` instance which
   * manages parameter selection based on the hardfork and EIP settings.
   *
   * This option allows providing a custom set of parameters. Note that parameters
   * get fully overwritten, so you need to extend the default parameter dict
   * to provide the full parameter set.
   *
   * It is recommended to deep-clone the params object for this to avoid side effects:
   *
   * ```ts
   * const params = JSON.parse(JSON.stringify(paramsVM))
   * params['1559']['elasticityMultiplier'] = 10 // 2
   * ```
   */
  params?: ParamsDict

  /**
   * Use a custom EVM to run Messages on. If this is not present, use the default EVM.
   */
  evm?: EVMInterface

  /**
   * Often there is no need to provide a full custom EVM but only a few options need to be
   * adopted. This option allows to provide a custom set of EVM options to be passed.
   *
   * Note: This option will throw if used in conjunction with a full custom EVM passed.
   */
  evmOpts?: EVMOpts

  profilerOpts?: VMProfilerOpts
}

/**
 * Options for the block builder.
 */
export interface BuilderOpts extends BlockOptions {
  /**
   * Whether to put the block into the vm's blockchain after building it.
   * This is useful for completing a full cycle when building a block so
   * the only next step is to build again, however it may not be desired
   * if the block is being emulated or may be discarded as to not affect
   * the underlying blockchain.
   *
   * Default: true
   */
  putBlockIntoBlockchain?: boolean
  /**
   * Provide a clique signer's privateKey to seal this block.
   * Will throw if provided on a non-PoA chain.
   */
  cliqueSigner?: Uint8Array
}

/**
 * Options for building a block.
 */
export interface BuildBlockOpts {
  /**
   * The parent block
   */
  parentBlock: Block

  /**
   * The block header data to use.
   * Defaults used for any values not provided.
   */
  headerData?: HeaderData

  withdrawals?: WithdrawalData[]
  /**
   * The block and builder options to use.
   */
  blockOpts?: BuilderOpts
}

/**
 * Options for sealing a block.
 */
export interface SealBlockOpts {
  /**
   * For PoW, the nonce.
   * Overrides the value passed in the constructor.
   */
  nonce?: Uint8Array

  /**
   * For PoW, the mixHash.
   * Overrides the value passed in the constructor.
   */
  mixHash?: Uint8Array
}

/**
 * Options for running a block.
 */
export interface RunBlockOpts {
  /**
   * The @ethereumjs/block to process
   */
  block: Block
  /**
   * Root of the state trie
   */
  root?: Uint8Array
  /**
   * Clearing the StateManager cache.
   *
   * If state root is not reset for whatever reason this can be set to `false` for better performance.
   *
   * Default: true
   */
  clearCache?: boolean
  /**
   * Whether to generate the stateRoot and other related fields.
   * If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
   * If `false`, `runBlock` throws if any fields do not match.
   * Defaults to `false`.
   */
  generate?: boolean

  /**
   * The stateRoot of the parent. Used for verifying the witness proofs in the context of Verkle.
   */
  parentStateRoot?: Uint8Array

  /**
   * If true, will skip "Block validation":
   * Block validation validates the header (with respect to the blockchain),
   * the transactions, the transaction trie and the uncle hash.
   */
  skipBlockValidation?: boolean
  /**
   * If true, skips the hardfork validation of vm, block
   * and tx
   */
  skipHardForkValidation?: boolean
  /**
   * if true, will skip "Header validation"
   * If the block has been picked from the blockchain to be executed,
   * header has already been validated, and can be skipped especially when
   * consensus of the chain has moved ahead.
   */
  skipHeaderValidation?: boolean
  /**
   * If true, skips the nonce check
   */
  skipNonce?: boolean
  /**
   * If true, checks the balance of the `from` account for the transaction and sets its
   * balance equal equal to the upfront cost (gas limit * gas price + transaction value)
   */
  skipBalance?: boolean
  /**
   * Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
   * for older Hfs.
   *
   * Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)
   */
  setHardfork?: boolean

  /**
   * If true, adds a hashedKey -> preimages mapping of all touched accounts
   * to the `RunTxResult` returned.
   */
  reportPreimages?: boolean
}

/**
 * Result of {@link applyBlock}
 */
export interface ApplyBlockResult {
  /**
   * The Bloom filter
   */
  bloom: Bloom
  /**
   * The gas used after executing the block
   */
  gasUsed: bigint
  /**
   * The receipt root after executing the block
   */
  receiptsRoot: Uint8Array
  /**
   * Receipts generated for transactions in the block
   */
  receipts: TxReceipt[]
  /**
   * Results of executing the transactions in the block
   */
  results: RunTxResult[]
  /**
   * Preimages mapping of the touched accounts from the block (see reportPreimages option)
   */
  preimages?: Map<PrefixedHexString, Uint8Array>
}

/**
 * Result of {@link runBlock}
 */
export interface RunBlockResult extends Omit<ApplyBlockResult, 'bloom'> {
  /**
   * The stateRoot after executing the block
   */
  stateRoot: Uint8Array
  /**
   * The bloom filter of the LOGs (events) after executing the block
   */
  logsBloom: Uint8Array

  /**
   * The requestsHash for any CL requests in the block
   */
  requestsHash?: Uint8Array
  /**
   * Any CL requests that were processed in the course of this block
   */
  requests?: CLRequest<CLRequestType>[]
}

export interface AfterBlockEvent extends RunBlockResult {
  // The block which just finished processing
  block: Block
}

/**
 * Options for the `runTx` method.
 */
export interface RunTxOpts {
  /**
   * The `@ethereumjs/block` the `tx` belongs to.
   * If omitted, a default blank block will be used.
   */
  block?: Block
  /**
   * An `@ethereumjs/tx` to run
   */
  tx: TypedTransaction
  /**
   * If true, skips the nonce check
   */
  skipNonce?: boolean

  /**
   * Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.
   */
  skipBalance?: boolean

  /**
   * If true, skips the validation of the tx's gas limit
   * against the block's gas limit.
   */
  skipBlockGasLimitValidation?: boolean

  /**
   * If true, skips the hardfork validation of vm, block
   * and tx
   */
  skipHardForkValidation?: boolean

  /**
   * If true, adds a generated EIP-2930 access list
   * to the `RunTxResult` returned.
   *
   * Option works with all tx types. EIP-2929 needs to
   * be activated (included in `berlin` HF).
   *
   * Note: if this option is used with a custom {@link StateManager} implementation
   * {@link StateManager.generateAccessList} must be implemented.
   */
  reportAccessList?: boolean

  /**
   * If true, adds a hashedKey -> preimages mapping of all touched accounts
   * to the `RunTxResult` returned.
   */
  reportPreimages?: boolean

  /**
   * To obtain an accurate tx receipt input the block gas used up until this tx.
   */
  blockGasUsed?: bigint
}

/**
 * Execution result of a transaction
 */
export interface RunTxResult extends EVMResult {
  /**
   * Bloom filter resulted from transaction
   */
  bloom: Bloom

  /**
   * The amount of ether used by this transaction
   */
  amountSpent: bigint

  /**
   * The tx receipt
   */
  receipt: TxReceipt

  /**
   * The amount of gas used in this transaction, which is paid for
   * This contains the gas units that have been used on execution, plus the upfront cost,
   * which consists of calldata cost, intrinsic cost and optionally the access list costs
   */
  totalGasSpent: bigint

  /**
   * The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)
   */
  gasRefund: bigint

  /**
   * EIP-2930 access list generated for the tx (see `reportAccessList` option)
   */
  accessList?: AccessList

  /**
   * Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)
   */
  preimages?: Map<PrefixedHexString, Uint8Array>

  /**
   * The value that accrues to the miner by this transaction
   */
  minerValue: bigint

  /**
   * This is the blob gas units times the fee per blob gas for 4844 transactions
   */
  blobGasUsed?: bigint
}

export interface AfterTxEvent extends RunTxResult {
  /**
   * The transaction which just got finished
   */
  transaction: TypedTransaction
}
