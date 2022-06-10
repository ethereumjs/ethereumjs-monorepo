import { AddressLike, BigIntLike, BufferLike, PrefixedHexString } from '@ethereumjs/util'
import Common from '@ethereumjs/common'
import { default as Transaction } from './legacyTransaction'
import { default as AccessListEIP2930Transaction } from './eip2930Transaction'
import { default as FeeMarketEIP1559Transaction } from './eip1559Transaction'

/**
 * Can be used in conjunction with {@link Transaction.supports}
 * to query on tx capabilities
 */
export enum Capability {
  /**
   * Tx supports EIP-155 replay protection
   * See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP
   */
  EIP155ReplayProtection = 155,

  /**
   * Tx supports EIP-1559 gas fee market mechansim
   * See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP
   */
  EIP1559FeeMarket = 1559,

  /**
   * Tx is a typed transaction as defined in EIP-2718
   * See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP
   */
  EIP2718TypedTransaction = 2718,

  /**
   * Tx supports access list generation as defined in EIP-2930
   * See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP
   */
  EIP2930AccessLists = 2930,
}

/**
 * The options for initializing a {@link Transaction}.
 */
export interface TxOptions {
  /**
   * A {@link Common} object defining the chain and hardfork for the transaction.
   *
   * Object will be internally copied so that tx behavior don't incidentally
   * change on future HF changes.
   *
   * Default: {@link Common} object set to `mainnet` and the default hardfork as defined in the {@link Common} class.
   *
   * Current default hardfork: `istanbul`
   */
  common?: Common
  /**
   * A transaction object by default gets frozen along initialization. This gives you
   * strong additional security guarantees on the consistency of the tx parameters.
   * It also enables tx hash caching when the `hash()` method is called multiple times.
   *
   * If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
   * add additional properties - it is strongly encouraged that you do the freeze yourself
   * within your code instead.
   *
   * Default: true
   */
  freeze?: boolean
}

/*
 * Access List types
 */

export type AccessListItem = {
  address: PrefixedHexString
  storageKeys: PrefixedHexString[]
}

/*
 * An Access List as a tuple of [address: Buffer, storageKeys: Buffer[]]
 */
export type AccessListBufferItem = [Buffer, Buffer[]]
export type AccessListBuffer = AccessListBufferItem[]
export type AccessList = AccessListItem[]

export function isAccessListBuffer(
  input: AccessListBuffer | AccessList
): input is AccessListBuffer {
  if (input.length === 0) {
    return true
  }
  const firstItem = input[0]
  if (Array.isArray(firstItem)) {
    return true
  }
  return false
}

export function isAccessList(input: AccessListBuffer | AccessList): input is AccessList {
  return !isAccessListBuffer(input) // This is exactly the same method, except the output is negated.
}

/**
 * Encompassing type for all transaction types.
 *
 * Note that this also includes legacy txs which are
 * referenced as {@link Transaction} for compatibility reasons.
 */
export type TypedTransaction =
  | Transaction
  | AccessListEIP2930Transaction
  | FeeMarketEIP1559Transaction

/**
 * Legacy {@link Transaction} Data
 */
export type TxData = {
  /**
   * The transaction's nonce.
   */
  nonce?: BigIntLike

  /**
   * The transaction's gas price.
   */
  gasPrice?: BigIntLike

  /**
   * The transaction's gas limit.
   */
  gasLimit?: BigIntLike

  /**
   * The transaction's the address is sent to.
   */
  to?: AddressLike

  /**
   * The amount of Ether sent.
   */
  value?: BigIntLike

  /**
   * This will contain the data of the message or the init of a contract.
   */
  data?: BufferLike

  /**
   * EC recovery ID.
   */
  v?: BigIntLike

  /**
   * EC signature parameter.
   */
  r?: BigIntLike

  /**
   * EC signature parameter.
   */
  s?: BigIntLike

  /**
   * The transaction type
   */

  type?: BigIntLike
}

/**
 * {@link AccessListEIP2930Transaction} data.
 */
export interface AccessListEIP2930TxData extends TxData {
  /**
   * The transaction's chain ID
   */
  chainId?: BigIntLike

  /**
   * The access list which contains the addresses/storage slots which the transaction wishes to access
   */
  accessList?: AccessListBuffer | AccessList
}

/**
 * {@link FeeMarketEIP1559Transaction} data.
 */
export interface FeeMarketEIP1559TxData extends AccessListEIP2930TxData {
  /**
   * The transaction's gas price, inherited from {@link Transaction}.  This property is not used for EIP1559
   * transactions and should always be undefined for this specific transaction type.
   */
  gasPrice?: never
  /**
   * The maximum inclusion fee per gas (this fee is given to the miner)
   */
  maxPriorityFeePerGas?: BigIntLike
  /**
   * The maximum total fee
   */
  maxFeePerGas?: BigIntLike
}

/**
 * Buffer values array for a legacy {@link Transaction}
 */
export type TxValuesArray = Buffer[]

/**
 * Buffer values array for an {@link AccessListEIP2930Transaction}
 */
export type AccessListEIP2930ValuesArray = [
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  AccessListBuffer,
  Buffer?,
  Buffer?,
  Buffer?
]

/**
 * Buffer values array for a {@link FeeMarketEIP1559Transaction}
 */
export type FeeMarketEIP1559ValuesArray = [
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  AccessListBuffer,
  Buffer?,
  Buffer?,
  Buffer?
]

type JsonAccessListItem = { address: string; storageKeys: string[] }

/**
 * Generic interface for all tx types with a
 * JSON representation of a transaction.
 *
 * Note that all values are marked as optional
 * and not all the values are present on all tx types
 * (an EIP1559 tx e.g. lacks a `gasPrice`).
 */
export interface JsonTx {
  nonce?: string
  gasPrice?: string
  gasLimit?: string
  to?: string
  data?: string
  v?: string
  r?: string
  s?: string
  value?: string
  chainId?: string
  accessList?: JsonAccessListItem[]
  type?: string
  maxPriorityFeePerGas?: string
  maxFeePerGas?: string
}
