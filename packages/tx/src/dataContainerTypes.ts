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

type ECDSASignedInterfaceType = Required<ECDSAMaybeSignedInterface>

export interface ECDSASignedInterface extends ECDSASignedInterfaceType {}

export type LegacyGasMarketFields = {
  gasPrice?: BigIntLike
}

export interface LegacyGasMarketInterface {
  readonly gasPrice: bigint
}

export interface LegacyTxInterface
  extends DefaultContainerInterface,
    CreateContractInterface,
    LegacyGasMarketInterface,
    ECDSAMaybeSignedInterface {}

export type ContainerInterface = {
  [TransactionType.Legacy]: LegacyTxInterface
}

// EIP-2930 (Access Lists) related types and interfaces
export type ChainIdFields = {
  chainId?: BigIntLike
}

export interface ChainIdInterface {
  chainId: bigint
}

export type AccessListFields = {
  accessList?: AccessListBytes | AccessList
}

export type EIP2930Fields = ChainIdFields & AccessListFields

export interface AccessListInterface {
  accessList: AccessListBytes
}

export interface AccessList2930Interface extends ChainIdInterface, AccessListInterface {}

// EIP-1559 (Fee market) related types and interfaces
export type FeeMarketFields = {
  maxPriorityFeePerGas?: BigIntLike
  maxFeePerGas?: BigIntLike
}

export interface FeeMarketInterface {
  readonly maxPriorityFeePerGas: bigint
  readonly maxFeePerGas: bigint
}

// EIP-4844 (Shard blob transactions) related types and fields
export type BlobFields = {
  blobVersionedHashes?: BytesLike[]
  maxFeePerBlobGas?: BigIntLike
  blobs?: BytesLike[]
  kzgCommitments?: BytesLike[]
  kzgProofs?: BytesLike[]
  blobsData?: string[] // TODO why is this string and not something like PrefixedHexString?
}

export interface BlobInterface {
  readonly blobVersionedHashes: PrefixedHexString[] // TODO why is this a string and not uint8array?
  readonly blobs?: PrefixedHexString[]
  readonly kzgCommitments?: PrefixedHexString[]
  readonly kzgProofs?: PrefixedHexString[]
  readonly maxFeePerBlobGas: bigint
}

// EIP-7702 (EOA code transactions) related types and fields
export type AuthorizationListFields = {
  authorizationList?: AuthorizationListBytes | AuthorizationList | never
}

export interface AuthorizationListInterface {
  readonly authorizationList: AuthorizationListBytes
}

// Below here: helper types
// Helper type which is common on the txs:
type DefaultFieldsMaybeSigned = DefaultFields & ECDSAMaybeSignedFields

// Helper type for the constructor fields of the txs
export type TxConstructorFields = {
  [TransactionType.Legacy]: DefaultFieldsMaybeSigned & CreateContractFields & LegacyGasMarketFields
  [TransactionType.AccessListEIP2930]: TxConstructorFields[TransactionType.Legacy] & EIP2930Fields
  [TransactionType.FeeMarketEIP1559]: Exclude<
    TxConstructorFields[TransactionType.AccessListEIP2930],
    LegacyGasMarketFields
  > &
    FeeMarketFields
  [TransactionType.BlobEIP4844]: Exclude<
    TxConstructorFields[TransactionType.FeeMarketEIP1559],
    CreateContractFields
  > &
    ToFields &
    BlobFields
  [TransactionType.EOACodeEIP7702]: Exclude<
    TxConstructorFields[TransactionType.FeeMarketEIP1559],
    CreateContractFields
  > &
    ToFields &
    AuthorizationListFields
}
