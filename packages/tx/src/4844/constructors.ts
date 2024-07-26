import { RLP } from '@ethereumjs/rlp'
import {
  bigIntToHex,
  blobsToCommitments,
  blobsToProofs,
  bytesToBigInt,
  bytesToHex,
  commitmentsToVersionedHashes,
  computeVersionedHash,
  equalsBytes,
  getBlobs,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'

import { TransactionType } from '../types.js'
import { AccessLists, txTypeBytes, validateNotArray } from '../util.js'

import { BlobEIP4844Transaction } from './tx.js'

import type {
  BlobEIP4844NetworkValuesArray,
  JsonBlobTxNetworkWrapper,
  TxOptions,
} from '../types.js'
import type { TxData, TxValuesArray } from './tx.js'
import type { Kzg } from '@ethereumjs/util'

const validateBlobTransactionNetworkWrapper = (
  blobVersionedHashes: Uint8Array[],
  blobs: Uint8Array[],
  commitments: Uint8Array[],
  kzgProofs: Uint8Array[],
  version: number,
  kzg: Kzg,
) => {
  if (!(blobVersionedHashes.length === blobs.length && blobs.length === commitments.length)) {
    throw new Error('Number of blobVersionedHashes, blobs, and commitments not all equal')
  }
  if (blobVersionedHashes.length === 0) {
    throw new Error('Invalid transaction with empty blobs')
  }

  let isValid
  try {
    isValid = kzg.verifyBlobKzgProofBatch(blobs, commitments, kzgProofs)
  } catch (error) {
    throw new Error(`KZG verification of blobs fail with error=${error}`)
  }
  if (!isValid) {
    throw new Error('KZG proof cannot be verified from blobs/commitments')
  }

  for (let x = 0; x < blobVersionedHashes.length; x++) {
    const computedVersionedHash = computeVersionedHash(commitments[x], version)
    if (!equalsBytes(computedVersionedHash, blobVersionedHashes[x])) {
      throw new Error(`commitment for blob at index ${x} does not match versionedHash`)
    }
  }
}

/**
 * Instantiate a transaction from a data dictionary.
 *
 * Format: { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
 * v, r, s, blobs, kzgCommitments, blobVersionedHashes, kzgProofs }
 *
 * Notes:
 * - `chainId` will be set automatically if not provided
 * - All parameters are optional and have some basic default values
 * - `blobs` cannot be supplied as well as `kzgCommittments`, `blobVersionedHashes`, `kzgProofs`
 * - If `blobs` is passed in,  `kzgCommittments`, `blobVersionedHashes`, `kzgProofs` will be derived by the constructor
 */
export function create4844BlobTx(txData: TxData, opts?: TxOptions) {
  if (opts?.common?.customCrypto?.kzg === undefined) {
    throw new Error(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }
  const kzg = opts!.common!.customCrypto!.kzg!
  if (txData.blobsData !== undefined) {
    if (txData.blobs !== undefined) {
      throw new Error('cannot have both raw blobs data and encoded blobs in constructor')
    }
    if (txData.kzgCommitments !== undefined) {
      throw new Error('cannot have both raw blobs data and KZG commitments in constructor')
    }
    if (txData.blobVersionedHashes !== undefined) {
      throw new Error('cannot have both raw blobs data and versioned hashes in constructor')
    }
    if (txData.kzgProofs !== undefined) {
      throw new Error('cannot have both raw blobs data and KZG proofs in constructor')
    }
    txData.blobs = getBlobs(txData.blobsData.reduce((acc, cur) => acc + cur))
    txData.kzgCommitments = blobsToCommitments(kzg, txData.blobs as Uint8Array[])
    txData.blobVersionedHashes = commitmentsToVersionedHashes(txData.kzgCommitments as Uint8Array[])
    txData.kzgProofs = blobsToProofs(
      kzg,
      txData.blobs as Uint8Array[],
      txData.kzgCommitments as Uint8Array[],
    )
  }

  return new BlobEIP4844Transaction(txData, opts)
}

/**
 * Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.
 *
 * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, signatureYParity, signatureR, signatureS]`
 */
export function create4844BlobTxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  if (opts.common?.customCrypto?.kzg === undefined) {
    throw new Error(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  if (values.length !== 11 && values.length !== 14) {
    throw new Error(
      'Invalid EIP-4844 transaction. Only expecting 11 values (for unsigned tx) or 14 values (for signed tx).',
    )
  }

  const [
    chainId,
    nonce,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    to,
    value,
    data,
    accessList,
    maxFeePerBlobGas,
    blobVersionedHashes,
    v,
    r,
    s,
  ] = values

  validateNotArray({ chainId, v })
  validateNoLeadingZeroes({
    nonce,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    value,
    maxFeePerBlobGas,
    v,
    r,
    s,
  })

  return new BlobEIP4844Transaction(
    {
      chainId: bytesToBigInt(chainId),
      nonce,
      maxPriorityFeePerGas,
      maxFeePerGas,
      gasLimit,
      to,
      value,
      data,
      accessList: accessList ?? [],
      maxFeePerBlobGas,
      blobVersionedHashes,
      v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
      r,
      s,
    },
    opts,
  )
}

/**
 * Instantiate a transaction from a RLP serialized tx.
 *
 * Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
 * access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`
 */
export function create4844BlobTxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  if (opts.common?.customCrypto?.kzg === undefined) {
    throw new Error(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  if (equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.BlobEIP4844)) === false) {
    throw new Error(
      `Invalid serialized tx input: not an EIP-4844 transaction (wrong tx type, expected: ${
        TransactionType.BlobEIP4844
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  const values = RLP.decode(serialized.subarray(1))

  if (!Array.isArray(values)) {
    throw new Error('Invalid serialized tx input: must be array')
  }

  return create4844BlobTxFromBytesArray(values as TxValuesArray, opts)
}

/**
 * Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)
 * @param serialized a buffer representing a serialized BlobTransactionNetworkWrapper
 * @param opts any TxOptions defined
 * @returns a BlobEIP4844Transaction
 */
export function create4844BlobTxFromSerializedNetworkWrapper(
  serialized: Uint8Array,
  opts?: TxOptions,
): BlobEIP4844Transaction {
  if (!opts || !opts.common) {
    throw new Error('common instance required to validate versioned hashes')
  }

  if (opts.common?.customCrypto?.kzg === undefined) {
    throw new Error(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  if (equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.BlobEIP4844)) === false) {
    throw new Error(
      `Invalid serialized tx input: not an EIP-4844 transaction (wrong tx type, expected: ${
        TransactionType.BlobEIP4844
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  // Validate network wrapper
  const networkTxValues = RLP.decode(serialized.subarray(1))
  if (networkTxValues.length !== 4) {
    throw Error(`Expected 4 values in the deserialized network transaction`)
  }
  const [txValues, blobs, kzgCommitments, kzgProofs] =
    networkTxValues as BlobEIP4844NetworkValuesArray

  // Construct the tx but don't freeze yet, we will assign blobs etc once validated
  const decodedTx = create4844BlobTxFromBytesArray(txValues, { ...opts, freeze: false })
  if (decodedTx.to === undefined) {
    throw Error('BlobEIP4844Transaction can not be send without a valid `to`')
  }

  const version = Number(opts.common.param('blobCommitmentVersionKzg'))
  validateBlobTransactionNetworkWrapper(
    decodedTx.blobVersionedHashes,
    blobs,
    kzgCommitments,
    kzgProofs,
    version,
    opts.common.customCrypto.kzg,
  )

  // set the network blob data on the tx
  decodedTx.blobs = blobs
  decodedTx.kzgCommitments = kzgCommitments
  decodedTx.kzgProofs = kzgProofs

  // freeze the tx
  const freeze = opts?.freeze ?? true
  if (freeze) {
    Object.freeze(decodedTx)
  }

  return decodedTx
}

/**
 * Creates the minimal representation of a blob transaction from the network wrapper version.
 * The minimal representation is used when adding transactions to an execution payload/block
 * @param txData a {@link BlobEIP4844Transaction} containing optional blobs/kzg commitments
 * @param opts - dictionary of {@link TxOptions}
 * @returns the "minimal" representation of a BlobEIP4844Transaction (i.e. transaction object minus blobs and kzg commitments)
 */
export function createMinimal4844TxFromNetworkWrapper(
  txData: BlobEIP4844Transaction,
  opts?: TxOptions,
): BlobEIP4844Transaction {
  if (opts?.common?.customCrypto?.kzg === undefined) {
    throw new Error(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  const tx = create4844BlobTx(
    {
      ...txData,
      ...{ blobs: undefined, kzgCommitments: undefined, kzgProofs: undefined },
    },
    opts,
  )
  return tx
}

/**
 * Returns the EIP 4844 transaction network wrapper in JSON format similar to toJSON, including
 * blobs, commitments, and proofs fields
 * @param serialized a buffer representing a serialized BlobTransactionNetworkWrapper
 * @param opts any TxOptions defined
 * @returns JsonBlobTxNetworkWrapper with blobs, KZG commitments, and KZG proofs fields
 */
export function blobTxNetworkWrapperToJSON(
  serialized: Uint8Array,
  opts?: TxOptions,
): JsonBlobTxNetworkWrapper {
  const tx = create4844BlobTxFromSerializedNetworkWrapper(serialized, opts)

  const accessListJSON = AccessLists.getAccessListJSON(tx.accessList)
  const baseJson = tx.toJSON()

  return {
    ...baseJson,
    chainId: bigIntToHex(tx.chainId),
    maxPriorityFeePerGas: bigIntToHex(tx.maxPriorityFeePerGas),
    maxFeePerGas: bigIntToHex(tx.maxFeePerGas),
    accessList: accessListJSON,
    maxFeePerBlobGas: bigIntToHex(tx.maxFeePerBlobGas),
    blobVersionedHashes: tx.blobVersionedHashes.map((hash) => bytesToHex(hash)),
    blobs: tx.blobs!.map((bytes) => bytesToHex(bytes)),
    kzgCommitments: tx.kzgCommitments!.map((bytes) => bytesToHex(bytes)),
    kzgProofs: tx.kzgProofs!.map((bytes) => bytesToHex(bytes)),
  }
}
