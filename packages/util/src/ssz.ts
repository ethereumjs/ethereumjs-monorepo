import { Tree, hasher } from '@chainsafe/persistent-merkle-tree'
import {
  BitArray,
  ByteListType,
  ByteVectorType,
  ContainerType,
  ListCompositeType,
  OptionalType,
  ProfileType,
  StableContainerType,
  UintBigintType,
  byteArrayEquals,
} from '@chainsafe/ssz'

import type { PrefixedHexString } from './types.js'
import type { ValueOf } from '@chainsafe/ssz'

export const MAX_CALLDATA_SIZE = 16_777_216
export const MAX_ACCESS_LIST_STORAGE_KEYS = 524_288
export const MAX_ACCESS_LIST_SIZE = 524_288

export const MAX_FEES_PER_GAS_FIELDS = 16
export const MAX_TRANSACTION_PAYLOAD_FIELDS = 32
export const MAX_TRANSACTION_SIGNATURE_FIELDS = 16
export const MAX_BLOB_COMMITMENTS_PER_BLOCK = 4096

export const Uint8 = new UintBigintType(1)
export const Uint64 = new UintBigintType(8)
export const Uint256 = new UintBigintType(32)

export const Bytes20 = new ByteVectorType(20)
export const Bytes32 = new ByteVectorType(32)
export const Bytes256 = new ByteVectorType(256)

export const FeePerGas = Uint256
export const ChainId = Uint64
export const TransactionType = Uint8
export const ExecutionAddress = Bytes20

function getFullArray(prefixVec: boolean[], maxVecLength: number): BitArray {
  const fullVec = [
    ...prefixVec,
    ...Array.from({ length: maxVecLength - prefixVec.length }, () => false),
  ]
  return BitArray.fromBoolArray(fullVec)
}

export const FeesPerGas = new StableContainerType(
  {
    regular: new OptionalType(FeePerGas),
    blob: new OptionalType(FeePerGas),
  },
  MAX_FEES_PER_GAS_FIELDS,
  { typeName: 'BasicFeesPerGas', jsonCase: 'eth2' },
)

export const AccessTuple = new ContainerType(
  {
    address: ExecutionAddress,
    storageKeys: new ListCompositeType(Bytes32, MAX_ACCESS_LIST_STORAGE_KEYS),
  },
  { typeName: 'AccessTuple', jsonCase: 'eth2' },
)

export const AccessList = new ListCompositeType(AccessTuple, MAX_ACCESS_LIST_SIZE)
export const TransactionTo = new OptionalType(ExecutionAddress)
export const TransactionInput = new ByteListType(MAX_CALLDATA_SIZE)
export const VersionedHashes = new ListCompositeType(Bytes32, MAX_BLOB_COMMITMENTS_PER_BLOCK)

export const SECP256K1_SIGNATURE_SIZE = 65
export const Secp256k1Signature = new ByteVectorType(SECP256K1_SIGNATURE_SIZE)

export const MAX_EXECUTION_SIGNATURE_FIELDS = 8
export const ExecutionSignature = new StableContainerType(
  {
    secp256k1: new OptionalType(Secp256k1Signature),
  },
  MAX_EXECUTION_SIGNATURE_FIELDS,
  { typeName: 'ExecutionSignature', jsonCase: 'eth2' },
)
export const Secp256k1ExecutionSignature = new ProfileType(
  { secp256k1: Secp256k1Signature },
  getFullArray([true], MAX_EXECUTION_SIGNATURE_FIELDS),
  { typeName: 'Secp256k1ExecutionSignature', jsonCase: 'eth2' },
)

export const MAX_AUTHORIZATION_PAYLOAD_FIELDS = 16
export const AuthorizationPayload = new StableContainerType(
  {
    magic: new OptionalType(TransactionType),
    chainId: new OptionalType(ChainId),
    address: new OptionalType(ExecutionAddress),
    nonce: new OptionalType(Uint64),
  },
  MAX_AUTHORIZATION_PAYLOAD_FIELDS,
  { typeName: 'AuthorizationPayload', jsonCase: 'eth2' },
)

export const Authorization = new ContainerType(
  {
    payload: AuthorizationPayload,
    signature: ExecutionSignature,
  },
  { typeName: 'Authorization', jsonCase: 'eth2' },
)

export const MAX_AUTHORIZATION_LIST_SIZE = 65_536
export const AuthorizationList = new ListCompositeType(Authorization, MAX_AUTHORIZATION_LIST_SIZE)

export const TransactionPayload = new StableContainerType(
  {
    type: new OptionalType(TransactionType),
    chainId: new OptionalType(ChainId),
    nonce: new OptionalType(Uint64),
    maxFeesPerGas: new OptionalType(FeesPerGas),
    gas: new OptionalType(Uint64),
    to: TransactionTo,
    value: new OptionalType(Uint256),
    input: new OptionalType(TransactionInput),
    accessList: new OptionalType(AccessList),
    maxPriorityFeesPerGas: new OptionalType(FeesPerGas),
    blobVersionedHashes: new OptionalType(VersionedHashes),
    authorizationList: new OptionalType(AuthorizationList),
  },
  MAX_TRANSACTION_PAYLOAD_FIELDS,
  { typeName: 'TransactionPayload', jsonCase: 'eth2' },
)

export const Transaction = new ContainerType(
  {
    payload: TransactionPayload,
    signature: ExecutionSignature,
  },
  { typeName: 'Transaction', jsonCase: 'eth2' },
)

export const BasicFeesPerGas = new ProfileType(
  { regular: FeePerGas },
  getFullArray([true], MAX_FEES_PER_GAS_FIELDS),
  { typeName: 'BasicFeesPerGas', jsonCase: 'eth2' },
)

export const BlobFeesPerGas = new ProfileType(
  {
    regular: FeePerGas,
    blob: FeePerGas,
  },
  getFullArray([true, true], MAX_FEES_PER_GAS_FIELDS),
  { typeName: 'BlobFeesPerGas', jsonCase: 'eth2' },
)

export const ReplayableTransactionPayload = new ProfileType(
  {
    type: TransactionType,
    nonce: Uint64,
    maxFeesPerGas: BasicFeesPerGas,
    gas: Uint64,
    to: TransactionTo,
    value: Uint256,
    input: TransactionInput,
  },
  getFullArray([true, false, true, true, true, true, true, true], MAX_FEES_PER_GAS_FIELDS),
  { typeName: 'ReplayableTransactionPayload', jsonCase: 'eth2' },
)

export const ReplayableTransaction = new ContainerType(
  {
    payload: ReplayableTransactionPayload,
    signature: Secp256k1ExecutionSignature,
  },
  { typeName: 'ReplayableTransaction', jsonCase: 'eth2' },
)

export const LegacyTransactionPayload = new ProfileType(
  {
    type: TransactionType,
    chainId: ChainId,
    nonce: Uint64,
    maxFeesPerGas: BasicFeesPerGas,
    gas: Uint64,
    to: TransactionTo,
    value: Uint256,
    input: TransactionInput,
  },
  getFullArray([true, true, true, true, true, true, true, true], MAX_FEES_PER_GAS_FIELDS),
  { typeName: 'LegacyTransactionPayload', jsonCase: 'eth2' },
)

export const LegacyTransaction = new ContainerType(
  {
    payload: LegacyTransactionPayload,
    signature: Secp256k1ExecutionSignature,
  },
  { typeName: 'LegacyTransaction', jsonCase: 'eth2' },
)

export const Eip2930TransactionPayload = new ProfileType(
  {
    type: TransactionType,
    chainId: ChainId,
    nonce: Uint64,
    maxFeesPerGas: BasicFeesPerGas,
    gas: Uint64,
    to: TransactionTo,
    value: Uint256,
    input: TransactionInput,
    accessList: AccessList,
  },
  getFullArray([true, true, true, true, true, true, true, true, true], MAX_FEES_PER_GAS_FIELDS),
  { typeName: 'Eip2930TransactionPayload', jsonCase: 'eth2' },
)

export const Eip2930Transaction = new ContainerType(
  {
    payload: Eip2930TransactionPayload,
    signature: Secp256k1ExecutionSignature,
  },
  { typeName: 'Eip2930Transaction', jsonCase: 'eth2' },
)

export const Eip1559TransactionPayload = new ProfileType(
  {
    type: TransactionType,
    chainId: ChainId,
    nonce: Uint64,
    maxFeesPerGas: BasicFeesPerGas,
    gas: Uint64,
    to: TransactionTo,
    value: Uint256,
    input: TransactionInput,
    accessList: AccessList,
    maxPriorityFeesPerGas: BasicFeesPerGas,
  },
  getFullArray(
    [true, true, true, true, true, true, true, true, true, true],
    MAX_FEES_PER_GAS_FIELDS,
  ),
  { typeName: 'Eip1559TransactionPayload', jsonCase: 'eth2' },
)

export const Eip1559Transaction = new ContainerType(
  {
    payload: Eip1559TransactionPayload,
    signature: Secp256k1ExecutionSignature,
  },
  { typeName: 'Eip1559Transaction', jsonCase: 'eth2' },
)

export const Eip4844TransactionPayload = new ProfileType(
  {
    type: TransactionType,
    chainId: ChainId,
    nonce: Uint64,
    maxFeesPerGas: BlobFeesPerGas,
    gas: Uint64,
    to: ExecutionAddress,
    value: Uint256,
    input: TransactionInput,
    accessList: AccessList,
    maxPriorityFeesPerGas: BlobFeesPerGas,
    blobVersionedHashes: VersionedHashes,
  },
  getFullArray(
    [true, true, true, true, true, true, true, true, true, true, true],
    MAX_FEES_PER_GAS_FIELDS,
  ),
  { typeName: 'Eip4844TransactionPayload', jsonCase: 'eth2' },
)

export const Eip4844Transaction = new ContainerType(
  {
    payload: Eip4844TransactionPayload,
    signature: Secp256k1ExecutionSignature,
  },
  { typeName: 'Eip4844Transaction', jsonCase: 'eth2' },
)

const MAX_WITHDRAWALS_PER_PAYLOAD = 16
export const Withdrawal = new ContainerType(
  {
    index: Uint64,
    validatorIndex: Uint64,
    address: ExecutionAddress,
    amount: Uint64,
  },
  { typeName: 'Withdrawal', jsonCase: 'eth2' },
)
export const Withdrawals = new ListCompositeType(Withdrawal, MAX_WITHDRAWALS_PER_PAYLOAD)

const MAX_TRANSACTIONS_PER_PAYLOAD = 1048576
export const Transactions = new ListCompositeType(Transaction, MAX_TRANSACTIONS_PER_PAYLOAD)
export const TransactionRootsList = new ListCompositeType(Bytes32, MAX_TRANSACTIONS_PER_PAYLOAD)
export type TransactionsType = ValueOf<typeof Transactions>

const TRANSACTION_GINDEX0 = 2097152n
export function computeTransactionInclusionProof(
  transactions: TransactionsType,
  index: number,
  fromRoots = true,
): { merkleBranch: Uint8Array[]; transactionRoot: Uint8Array } {
  if (index >= transactions.length) {
    throw Error(`Invalid index=${index} > transactions=${transactions.length}`)
  }

  const transactionRoot = Transaction.hashTreeRoot(transactions[index])

  let merkleBranch
  if (fromRoots === true) {
    const transactionRoots = transactions.map((tx) => Transaction.hashTreeRoot(tx))
    const TransactionsRootView = TransactionRootsList.toView(transactionRoots)
    // transaction index is its g index in the list
    merkleBranch = new Tree(TransactionsRootView.node).getSingleProof(
      TRANSACTION_GINDEX0 + BigInt(index),
    )
  } else {
    const TransactionsView = Transactions.toView(transactions)
    // transaction index is its g index in the list
    merkleBranch = new Tree(TransactionsView.node).getSingleProof(
      TRANSACTION_GINDEX0 + BigInt(index),
    )
  }

  return { merkleBranch, transactionRoot }
}

const TRANSACTION_PROOF_DEPTH = 21
/**
 * Verify that the given ``leaf`` is on the merkle branch ``proof``
 * starting with the given ``root``.
 *
 * Browser friendly version of verifyMerkleBranch
 */
export function isValidTransactionProof(
  transactionRoot: Uint8Array,
  proof: Uint8Array[],
  index: number,
  transactionsRoot: Uint8Array,
): boolean {
  let value = transactionRoot
  for (let i = 0; i < TRANSACTION_PROOF_DEPTH; i++) {
    if (Math.floor(index / 2 ** i) % 2) {
      value = hasher.digest64(proof[i], value)
    } else {
      value = hasher.digest64(value, proof[i])
    }
  }
  return byteArrayEquals(value, transactionsRoot)
}

export type FeesPerGasV1 = {
  regular: PrefixedHexString | null // Quantity 64 bytes
  blob: PrefixedHexString | null // Quantity 64 bytes
}

export type AccessTupleV1 = {
  address: PrefixedHexString // DATA 20 bytes
  storageKeys: PrefixedHexString[] // Data 32 bytes MAX_ACCESS_LIST_STORAGE_KEYS array
}

export type ExecutionSignatureV1 = {
  secp256k1: PrefixedHexString | null // DATA 65 bytes
}

export type AuthorizationPayloadV1 = {
  magic: PrefixedHexString | null // Quantity 1 byte,
  chainId: PrefixedHexString | null // Quantity 8 bytes
  address: PrefixedHexString | null // DATA 20 bytes
  nonce: PrefixedHexString | null //Quantity 8 bytes
}

export type AuthorizationV1 = {
  payload: AuthorizationPayloadV1
  signature: ExecutionSignatureV1
}

export type TransactionPayloadV1 = {
  type: PrefixedHexString | null // Quantity, 1 byte
  chainId: PrefixedHexString | null // Quantity 8 bytes
  nonce: PrefixedHexString | null // Quantity 8 bytes
  maxFeesPerGas: FeesPerGasV1 | null
  gas: PrefixedHexString | null // Quantity 8 bytes
  to: PrefixedHexString | null // DATA 20 bytes
  value: PrefixedHexString | null // Quantity 64 bytes
  input: PrefixedHexString | null // max MAX_CALLDATA_SIZE bytes,
  accessList: AccessTupleV1[] | null
  maxPriorityFeesPerGas: FeesPerGasV1 | null
  blobVersionedHashes: PrefixedHexString[] | null // DATA 32 bytes array
  authorizationList: AuthorizationV1[] | null
}

export type TransactionV1 = {
  payload: TransactionPayloadV1
  signature: ExecutionSignatureV1
}

export const MAX_BLOCKHEADER_FIELDS = 64
const MAX_EXTRA_DATA_BYTES = 32

export const BlockHeader = new StableContainerType(
  {
    parentHash: new OptionalType(Bytes32),
    coinbase: new OptionalType(Bytes20),
    stateRoot: new OptionalType(Bytes32),
    transactionsTrie: new OptionalType(Bytes32),
    receiptsTrie: new OptionalType(Bytes32),
    number: new OptionalType(Uint64),
    gasLimits: new OptionalType(FeesPerGas),
    gasUsed: new OptionalType(FeesPerGas),
    timestamp: new OptionalType(Uint64),
    extraData: new OptionalType(new ByteListType(MAX_EXTRA_DATA_BYTES)),
    mixHash: new OptionalType(Bytes32),
    baseFeePerGas: new OptionalType(FeesPerGas),
    withdrawalsRoot: new OptionalType(Bytes32),
    excessGas: new OptionalType(FeesPerGas),
    parentBeaconBlockRoot: new OptionalType(Bytes32),
    requestsRoot: new OptionalType(Bytes32),
  },
  MAX_BLOCKHEADER_FIELDS,
  { typeName: 'BlockHeader', jsonCase: 'eth2' },
)
