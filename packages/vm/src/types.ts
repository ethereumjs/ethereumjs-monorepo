import { Block, BlockOptions, HeaderData } from '@ethereumjs/block'
import { AccessList, TypedTransaction } from '@ethereumjs/tx'
import { EEIInterface, EVMInterface, EVMResult, Log } from '@ethereumjs/evm'
import { BigIntLike } from '@ethereumjs/util'
import Blockchain from '@ethereumjs/blockchain'
import { StateManager } from '@ethereumjs/statemanager'
import Common from '@ethereumjs/common'
import { Bloom } from './bloom'
export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt

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
  bitvector: Buffer
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
  stateRoot: Buffer
}

/**
 * Receipt type for Byzantium and beyond replacing the intermediary
 * state root field with a status code field (EIP-658)
 */
export interface PostByzantiumTxReceipt extends BaseTxReceipt {
  /**
   * Status of transaction, `1` if successful, `0` if an exception occured
   */
  status: 0 | 1
}

export type VMEvents = {
  beforeBlock: (data: Block, resolve?: (result: any) => void) => void
  afterBlock: (data: AfterBlockEvent, resolve?: (result: any) => void) => void
  beforeTx: (data: TypedTransaction, resolve?: (result: any) => void) => void
  afterTx: (data: AfterTxEvent, resolve?: (result: any) => void) => void
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
   * - `hardfork`: `mainnet` hardforks up to the `London` hardfork
   * - `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)
   *
   * ### Supported EIPs
   *
   * - [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153) - Transient Storage Opcodes (`experimental`)
   * - [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - EIP-1559 Fee Market
   * - [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) - VM simple subroutines (`experimental`)
   * - [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles (`experimental`)
   * - [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp Gas Cost
   * - [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Typed Transactions
   * - [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access opcodes
   * - [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Access List Transaction Type
   * - [EIP-3074](https://eips.ethereum.org/EIPS/eip-3074) - AUTH and AUTHCALL opcodes
   * - [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - BASEFEE opcode
   * - [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
   * - [EIP-3540](https://eips.ethereum.org/EIPS/eip-3541) - EVM Object Format (EOF) v1 (`experimental`)
   * - [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte
   *   [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) - Warm COINBASE (`experimental`)
   * - [EIP-3670](https://eips.ethereum.org/EIPS/eip-3670) - EOF - Code Validation (`experimental`)
   * - [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) - PUSH0 instruction (`experimental`)
   * - [EIP-3860](https://eips.ethereum.org/EIPS/eip-3860) - Limit and meter initcode (`experimental`)
   * - [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge) (`experimental`)
   *
   * *Annotations:*
   *
   * - `experimental`: behaviour can change on patch versions
   *
   * ### Default Setup
   *
   * Default setup if no `Common` instance is provided:
   *
   * - `chain`: `mainnet`
   * - `hardfork`: `london`
   * - `eips`: `[]`
   */
  common?: Common
  /**
   * A {@link StateManager} instance to use as the state store
   */
  stateManager?: StateManager
  /**
   * A {@link Blockchain} object for storing/retrieving blocks
   */
  blockchain?: Blockchain
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
   * If true, the state of the VM will add the genesis state given by {@link Blockchain.genesisState} to a newly
   * created state manager instance. Note that if stateManager option is also passed as argument
   * this flag won't have any effect.
   *
   * Default: `false`
   */
  activateGenesisState?: boolean

  /**
   * Select hardfork based upon block number. This automatically switches to the right hard fork based upon the block number.
   *
   * Default: `false`
   */
  hardforkByBlockNumber?: boolean
  /**
   * Select the HF by total difficulty (Merge HF)
   *
   * This option is a superset of `hardforkByBlockNumber` (so only use one of both options)
   * and determines the HF by both the block number and the TD.
   *
   * Since the TD is only a threshold the block number will in doubt take precedence (imagine
   * e.g. both Merge and Shanghai HF blocks set and the block number from the block provided
   * pointing to a Shanghai block: this will lead to set the HF as Shanghai and not the Merge).
   */
  hardforkByTD?: BigIntLike

  /**
   * Use a custom EEI for the EVM. If this is not present, use the default EEI.
   */
  eei?: EEIInterface

  /**
   * Use a custom EVM to run Messages on. If this is not present, use the default EVM.
   */
  evm?: EVMInterface
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
  nonce?: Buffer

  /**
   * For PoW, the mixHash.
   * Overrides the value passed in the constructor.
   */
  mixHash?: Buffer
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
  root?: Buffer
  /**
   * Whether to generate the stateRoot and other related fields.
   * If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
   * If `false`, `runBlock` throws if any fields do not match.
   * Defaults to `false`.
   */
  generate?: boolean
  /**
   * If true, will skip "Block validation":
   * Block validation validates the header (with respect to the blockchain),
   * the transactions, the transaction trie and the uncle hash.
   */
  skipBlockValidation?: boolean
  /**
   * If true, skips the nonce check
   */
  skipNonce?: boolean
  /**
   * If true, skips the balance check
   */
  skipBalance?: boolean
  /**
   * For merge transition support, pass the chain TD up to the block being run
   */
  hardforkByTD?: bigint
}

/**
 * Result of {@link runBlock}
 */
export interface RunBlockResult {
  /**
   * Receipts generated for transactions in the block
   */
  receipts: TxReceipt[]
  /**
   * Results of executing the transactions in the block
   */
  results: RunTxResult[]
  /**
   * The stateRoot after executing the block
   */
  stateRoot: Buffer
  /**
   * The gas used after executing the block
   */
  gasUsed: bigint
  /**
   * The bloom filter of the LOGs (events) after executing the block
   */
  logsBloom: Buffer
  /**
   * The receipt root after executing the block
   */
  receiptRoot: Buffer
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
   * This contains the gas units t
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
}

export interface AfterTxEvent extends RunTxResult {
  /**
   * The transaction which just got finished
   */
  transaction: TypedTransaction
}
