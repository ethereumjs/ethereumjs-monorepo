import type {
  AccessList,
  AccessListBytes,
  AuthorizationList,
  AuthorizationListBytes,
  JSONTx,
  TransactionType,
} from './types.js'
import type {
  Address,
  AddressLike,
  BigIntLike,
  BytesLike,
  PrefixedHexString,
} from '@ethereumjs/util'

// TODO
// Make a very simple "Features" class which handles supports/activate/deactivate (?)

export enum Feature {
  ReplayProtection = 'ReplayProtection', // For EIP-155 replay protection
  ECDSASignable = 'ECDSASignable', // For unsigned/signed ECDSA containers
  ECDSASigned = 'ECDSASigned', // For signed ECDSA containers

  LegacyGasMarket = 'LegacyGasMarket', // Txs with legacy gas market (pre-1559)
  FeeMarket = 'FeeMarket', // Txs with EIP1559 gas market

  TypedTransaction = 'TypedTransaction',

  AccessLists = 'AccessLists',
  EOACode = 'EOACode',
}

export type NestedUint8Array = (Uint8Array | NestedUint8Array)[]

export interface TxContainerMethods {
  supports(capability: Feature): boolean
  type: TransactionType

  // Raw list of Uint8Arrays (can be nested)
  raw(): NestedUint8Array // TODO make more tx-specific

  // The serialized version of the raw() one
  // (current: RLP.encode)
  serialize(): Uint8Array

  // Utility to convert to a JSON object
  toJSON(): JSONTx

  /** Signature related stuff, TODO */
  /*
    isSigned(): boolean
    isValid(): boolean
    verifySignature(): boolean
    getSenderAddress(): Address
    getSenderPublicKey(): Uint8Array
    sign(privateKey: Uint8Array): Transaction[T]
    errorStr(): string
  
    addSignature(
      v: bigint,
      r: Uint8Array | bigint,
      s: Uint8Array | bigint,
      convertV?: boolean,
    ): Transaction[T]
  
  
    // Get the non-hashed message to sign (this is input, but then hashed, is input to methods like ecsign)
    getMessageToSign(): Uint8Array | Uint8Array[]
    // Get the hashed message to sign (allows for flexibility over the hash method, now: keccak256)
    getHashedMessageToSign(): Uint8Array
  
    // The hash of the transaction (note: hash currently has to do with signed txs but on L2 likely can also be of non-signed txs (?))
    hash(): Uint8Array
  
    */
}

// Container "fields" and container "interface" below
// Fields: used for the CONSTRUCTOR of the containers
// Interface: used for the resulting constructor, so each param of the field is converted to that type before resulting in the container

export type DefaultFields = {
  nonce?: BigIntLike
  gasLimit?: BigIntLike
  to?: AddressLike
  value?: BigIntLike
  data?: BytesLike | '' // Note: '' is for empty data (TODO look if we want to keep this)
}

export interface DefaultContainerInterface {
  readonly nonce: bigint
  readonly gasLimit: bigint
  readonly value: bigint
  readonly data: Uint8Array
}

export type CreateContractFields = {
  to?: AddressLike | '' | null
}

export interface CreateContractInterface {
  to: Address | null
}

// Equivalent of CreateContractDataFields but does not allow "null" or the empty string.
export type ToFields = {
  to?: AddressLike
}

export interface ToInterface {
  to: Address
}

export type ECDSAMaybeSignedFields = {
  v?: BigIntLike
  r?: BigIntLike
  s?: BigIntLike
}

export type ECDSASignedFields = Required<ECDSAMaybeSignedFields>

// Note: only container interface with values which could be undefined due to unsigned containers
export interface ECDSAMaybeSignedInterface {
  readonly v?: bigint
  readonly r?: bigint
  readonly s?: bigint
}

export type LegacyGasMarketFields = {
  gasPrice: BigIntLike
}

export interface LegacyGasMarketInterface {
  readonly gasPrice: bigint
}

export type TxConstructorFields = {
  [TransactionType.Legacy]: DefaultFields &
    CreateContractFields &
    LegacyGasMarketFields &
    ECDSASignedFields
}

export interface LegacyTxInterface
  extends DefaultContainerInterface,
    CreateContractInterface,
    LegacyGasMarketInterface,
    ECDSAMaybeSignedInterface {}

export type ContainerInterface = {
  [TransactionType.Legacy]: LegacyTxInterface
}

// Below here TODO
/*
export interface LegacyContainerInterface extends L1DefaultContainer, LegacyGasMarketInterface {
  // to: DefaultContainerInterface['to'] | null
}

export type ChainIdFields = {
  chainId?: BigIntLike
}

export interface ChainIdInterface {
  chainId: bigint
}

export type AccessListFields = {
  accessList?: AccessListBytes | AccessList | null
}

export interface AccessListInterface {
  accessList: AccessListBytes
}

interface L1_2930Interface extends L1DefaultContainer, ChainIdInterface, AccessListInterface {}

export interface AccessList2930ContainerInterface
  extends L1_2930Interface,
    LegacyGasMarketInterface {}

// interface AccessList2930Interface: L1DefaultFields, ContractCreationDataFields, LegacyGasMarket, ChainId, AccessList

// EIP1559 txs
export type FeeMarketFields = {
  maxPriorityFeePerGas?: BigIntLike
  maxFeePerGas?: BigIntLike
}

export interface FeeMarketInterface {
  readonly maxPriorityFeePerGas: bigint
  readonly maxFeePerGas: bigint
}

export interface FeeMarket1559Interface extends L1_2930Interface, FeeMarketInterface {}

// EIP4844 txs
export type BlobFields = {
  blobVersionedHashes?: BytesLike[]
  maxFeePerBlobGas?: BigIntLike
  blobs?: BytesLike[]
  kzgCommitments?: BytesLike[]
  kzgProofs?: BytesLike[]
  blobsData?: string[]
}

export interface BlobInterface {
  readonly blobVersionedHashes: PrefixedHexString[] // TODO why is this a string and not uint8array?
  readonly blobs?: PrefixedHexString[]
  readonly kzgCommitments?: PrefixedHexString[]
  readonly kzgProofs?: PrefixedHexString[]
  readonly maxFeePerBlobGas: bigint
}

export interface Blob4844Interface extends FeeMarket1559Interface, BlobInterface {}

// EIP7702 txs

export type AuthorizationListFields = {
  authorizationList?: AuthorizationListBytes | AuthorizationList | never
}

export interface AuthorizationListInterface {
  readonly authorizationList: AuthorizationListBytes
}

export interface EOA7702Interface extends FeeMarket1559Interface, AuthorizationListInterface {}
*/
