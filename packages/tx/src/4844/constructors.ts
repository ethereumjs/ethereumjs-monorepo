import { RLP } from '@ethereumjs/rlp'
import {
  CELLS_PER_EXT_BLOB,
  EthereumJSErrorWithoutCode,
  bigIntToHex,
  blobsToCellProofs,
  blobsToCells,
  blobsToCommitments,
  blobsToProofs,
  bytesToBigInt,
  bytesToHex,
  bytesToInt,
  commitmentsToVersionedHashes,
  computeVersionedHash,
  equalsBytes,
  getBlobs,
  intToHex,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'

import { paramsTx } from '../params.ts'
import { TransactionType } from '../types.ts'
import { accessListBytesToJSON } from '../util/access.ts'

import { Blob4844Tx, NetworkWrapperType } from './tx.ts'

import type { KZG, PrefixedHexString } from '@ethereumjs/util'
import type {
  BlobEIP4844NetworkValuesArray,
  BlobEIP7594NetworkValuesArray,
  JSONBlobTxNetworkWrapper,
  TxOptions,
} from '../types.ts'
import { txTypeBytes, validateNotArray } from '../util/internal.ts'
import type { TxData, TxValuesArray } from './tx.ts'

const validateBlobTransactionNetworkWrapper = (
  networkWrapperVersion: NetworkWrapperType,
  blobVersionedHashes: PrefixedHexString[],
  blobs: PrefixedHexString[],
  commitments: PrefixedHexString[],
  kzgProofs: PrefixedHexString[],
  version: number,
  kzg: KZG,
) => {
  if (!(blobVersionedHashes.length === blobs.length && blobs.length === commitments.length)) {
    throw EthereumJSErrorWithoutCode(
      'Number of blobVersionedHashes, blobs, and commitments not all equal',
    )
  }
  if (blobVersionedHashes.length === 0) {
    throw EthereumJSErrorWithoutCode('Invalid transaction with empty blobs')
  }

  let isValid
  try {
    if (networkWrapperVersion === NetworkWrapperType.EIP4844) {
      isValid = kzg.verifyBlobProofBatch(blobs, commitments, kzgProofs)
    } else {
      const [cells, indices] = blobsToCells(kzg, blobs)
      // verifyCellKzgProofBatch expected dup commitments and indices corresponding with cells and proofs
      const dupCommitments = []
      const dupIndices = []
      for (let i = 0; i < blobs.length; i++) {
        for (let j = 0; j < CELLS_PER_EXT_BLOB; j++) {
          dupCommitments.push(commitments[i])
          dupIndices.push(indices[j])
        }
      }
      isValid = kzg.verifyCellKzgProofBatch(dupCommitments, dupIndices, cells, kzgProofs)
    }
  } catch (error) {
    throw EthereumJSErrorWithoutCode(`KZG verification of blobs fail with error=${error}`)
  }
  if (!isValid) {
    throw EthereumJSErrorWithoutCode('KZG proof cannot be verified from blobs/commitments')
  }

  for (let x = 0; x < blobVersionedHashes.length; x++) {
    const computedVersionedHash = computeVersionedHash(commitments[x], version)
    if (computedVersionedHash !== blobVersionedHashes[x]) {
      throw EthereumJSErrorWithoutCode(
        `commitment for blob at index ${x} does not match versionedHash`,
      )
    }
  }
}

/**
 * Instantiate a Blob4844Tx transaction from a data dictionary.
 *
 * If blobs are provided the tx will be instantiated in the "Network Wrapper" format,
 * otherwise in the canonical form represented on-chain.
 *
 * @param txData - Transaction data object containing:
 *   - `chainId` - Chain ID (will be set automatically if not provided)
 *   - `nonce` - Transaction nonce
 *   - `maxPriorityFeePerGas` - Maximum priority fee per gas (EIP-1559)
 *   - `maxFeePerGas` - Maximum fee per gas (EIP-1559)
 *   - `gasLimit` - Gas limit for the transaction
 *   - `to` - Recipient address (optional for contract creation)
 *   - `value` - Value to transfer in wei
 *   - `data` - Transaction data
 *   - `accessList` - Access list for EIP-2930 (optional)
 *   - `maxFeePerBlobGas` - Maximum fee per blob gas (EIP-4844)
 *   - `blobVersionedHashes` - Versioned hashes for blob validation
 *   - `v`, `r`, `s` - Signature components (for signed transactions)
 *   - `blobs` - Raw blob data (optional, will derive commitments/proofs)
 *   - `blobsData` - Array of strings to construct blobs from (optional)
 *   - `kzgCommitments` - KZG commitments (optional, derived from blobs if not provided)
 *   - `kzgProofs` - KZG proofs (optional, derived from blobs if not provided)
 *   - `networkWrapperVersion` - Network wrapper version (0=EIP-4844, 1=EIP-7594)
 * @param opts - Transaction options including Common instance with KZG initialized
 * @returns A new Blob4844Tx instance
 *
 * @throws {EthereumJSErrorWithoutCode} If KZG is not initialized in Common
 * @throws {EthereumJSErrorWithoutCode} If both blobsData and blobs are provided
 *
 * Notes:
 * - Requires a Common instance with `customCrypto.kzg` initialized
 * - Cannot provide both `blobsData` and `blobs` simultaneously
 * - If `blobs` or `blobsData` is provided, `kzgCommitments`, `blobVersionedHashes`, and `kzgProofs` will be automatically derived
 * - KZG proof type depends on EIP-7594 activation: per-Blob proofs (EIP-4844) or per-Cell proofs (EIP-7594)
 */
export function createBlob4844Tx(txData: TxData, opts?: TxOptions) {
  if (opts?.common?.customCrypto?.kzg === undefined) {
    throw EthereumJSErrorWithoutCode(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }
  const kzg = opts!.common!.customCrypto!.kzg!

  if (txData.blobsData !== undefined && txData.blobs !== undefined) {
    throw EthereumJSErrorWithoutCode(
      'cannot have both raw blobs data and encoded blobs in constructor',
    )
  }
  if (txData.blobsData !== undefined || txData.blobs !== undefined) {
    txData.blobs ??= getBlobs(
      txData.blobsData!.reduce((acc, cur) => acc + cur),
    ) as PrefixedHexString[]
    txData.kzgCommitments ??= blobsToCommitments(kzg, txData.blobs as PrefixedHexString[])
    txData.blobVersionedHashes ??= commitmentsToVersionedHashes(
      txData.kzgCommitments as PrefixedHexString[],
    )
    if (opts!.common!.isActivatedEIP(7594)) {
      txData.kzgProofs ??= blobsToCellProofs(kzg, txData.blobs as PrefixedHexString[])
    } else {
      txData.kzgProofs ??= blobsToProofs(
        kzg,
        txData.blobs as PrefixedHexString[],
        txData.kzgCommitments as PrefixedHexString[],
      )
    }
  }

  return new Blob4844Tx(txData, opts)
}

/**
 * Create a Blob4844Tx transaction from an array of byte encoded values ordered according to the devp2p network encoding.
 * Only canonical format supported, otherwise use `createBlob4844TxFromSerializedNetworkWrapper()`.
 *
 * @param values - Array of byte encoded values containing:
 *   - `chainId` - Chain ID as Uint8Array
 *   - `nonce` - Transaction nonce as Uint8Array
 *   - `maxPriorityFeePerGas` - Maximum priority fee per gas (EIP-1559) as Uint8Array
 *   - `maxFeePerGas` - Maximum fee per gas (EIP-1559) as Uint8Array
 *   - `gasLimit` - Gas limit for the transaction as Uint8Array
 *   - `to` - Recipient address as Uint8Array (optional for contract creation)
 *   - `value` - Value to transfer in wei as Uint8Array
 *   - `data` - Transaction data as Uint8Array
 *   - `accessList` - Access list for EIP-2930 as Uint8Array (optional)
 *   - `maxFeePerBlobGas` - Maximum fee per blob gas (EIP-4844) as Uint8Array
 *   - `blobVersionedHashes` - Versioned hashes for blob validation as Uint8Array[]
 *   - `v` - Signature recovery ID as Uint8Array (for signed transactions)
 *   - `r` - Signature r component as Uint8Array (for signed transactions)
 *   - `s` - Signature s component as Uint8Array (for signed transactions)
 * @param opts - Transaction options including Common instance with KZG initialized
 * @returns A new Blob4844Tx instance
 *
 * @throws {EthereumJSErrorWithoutCode} If KZG is not initialized in Common
 * @throws {EthereumJSErrorWithoutCode} If values array length is not 11 (unsigned) or 14 (signed)
 *
 * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, maxFeePerBlobGas, blobVersionedHashes, v, r, s]`
 *
 * Notes:
 * - Requires a Common instance with `customCrypto.kzg` initialized
 * - Supports both unsigned (11 values) and signed (14 values) transaction formats
 * - All numeric values must be provided as Uint8Array byte representations
 */
export function createBlob4844TxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  if (opts.common?.customCrypto?.kzg === undefined) {
    throw EthereumJSErrorWithoutCode(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  if (values.length !== 11 && values.length !== 14) {
    throw EthereumJSErrorWithoutCode(
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

  return new Blob4844Tx(
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
 * Instantiate a Blob4844Tx transaction from an RLP serialized transaction.
 * Only canonical format supported, otherwise use `createBlob4844TxFromSerializedNetworkWrapper()`.
 *
 * @param serialized - RLP serialized transaction data as Uint8Array
 * @param opts - Transaction options including Common instance with KZG initialized
 * @returns A new Blob4844Tx instance
 *
 * @throws {EthereumJSErrorWithoutCode} If KZG is not initialized in Common
 * @throws {EthereumJSErrorWithoutCode} If serialized data is not a valid EIP-4844 transaction
 * @throws {EthereumJSErrorWithoutCode} If RLP decoded data is not an array
 *
 * Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
 * access_list, max_fee_per_blob_gas, blob_versioned_hashes, y_parity, r, s])`
 *
 * Notes:
 * - Requires a Common instance with `customCrypto.kzg` initialized
 * - Transaction type byte must be 0x03 (BlobEIP4844)
 * - RLP payload must decode to an array of transaction fields
 * - Delegates to `createBlob4844TxFromBytesArray` for actual construction
 */
export function createBlob4844TxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  if (opts.common?.customCrypto?.kzg === undefined) {
    throw EthereumJSErrorWithoutCode(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  if (equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.BlobEIP4844)) === false) {
    throw EthereumJSErrorWithoutCode(
      `Invalid serialized tx input: not an EIP-4844 transaction (wrong tx type, expected: ${
        TransactionType.BlobEIP4844
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  const values = RLP.decode(serialized.subarray(1))

  if (!Array.isArray(values)) {
    throw EthereumJSErrorWithoutCode('Invalid serialized tx input: must be array')
  }

  return createBlob4844TxFromBytesArray(values as TxValuesArray, opts)
}

/**
 * Creates a Blob4844Tx transaction from the network encoding of a blob transaction wrapper.
 * This function handles the "Network Wrapper" format that includes blobs, commitments, and proofs.
 *
 * @param serialized - Serialized BlobTransactionNetworkWrapper as Uint8Array
 * @param opts - Transaction options including Common instance with KZG initialized
 * @returns A new Blob4844Tx instance with network wrapper data
 *
 * @throws {EthereumJSErrorWithoutCode} If Common instance is not provided
 * @throws {EthereumJSErrorWithoutCode} If KZG is not initialized in Common
 * @throws {EthereumJSErrorWithoutCode} If serialized data is not a valid EIP-4844 transaction
 * @throws {Error} If network wrapper has invalid number of values (not 4 or 5)
 * @throws {Error} If transaction has no valid `to` address
 * @throws {Error} If network wrapper version is invalid
 * @throws {EthereumJSErrorWithoutCode} If KZG verification fails
 * @throws {EthereumJSErrorWithoutCode} If versioned hashes don't match commitments
 *
 * Network Wrapper Formats:
 * - EIP-4844: `0x03 || rlp([tx_values, blobs, kzg_commitments, kzg_proofs])` (4 values)
 * - EIP-7594: `0x03 || rlp([tx_values, network_wrapper_version, blobs, kzg_commitments, kzg_proofs])` (5 values)
 *
 * Notes:
 * - Requires a Common instance with `customCrypto.kzg` initialized
 * - Validates KZG proofs against blobs and commitments
 * - Verifies versioned hashes match computed commitments
 * - Supports both EIP-4844 and EIP-7594 network wrapper formats
 * - Transaction is frozen by default unless `opts.freeze` is set to false
 */
export function createBlob4844TxFromSerializedNetworkWrapper(
  serialized: Uint8Array,
  opts?: TxOptions,
): Blob4844Tx {
  if (!opts || !opts.common) {
    throw EthereumJSErrorWithoutCode('common instance required to validate versioned hashes')
  }

  if (opts.common?.customCrypto?.kzg === undefined) {
    throw EthereumJSErrorWithoutCode(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  if (equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.BlobEIP4844)) === false) {
    throw EthereumJSErrorWithoutCode(
      `Invalid serialized tx input: not an EIP-4844 transaction (wrong tx type, expected: ${
        TransactionType.BlobEIP4844
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  // Validate network wrapper
  const networkTxValues = RLP.decode(serialized.subarray(1))
  let txValues, blobs, kzgCommitments, kzgProofs, networkWrapperVersion
  if (networkTxValues.length === 4) {
    ;[txValues, blobs, kzgCommitments, kzgProofs] = networkTxValues as BlobEIP4844NetworkValuesArray
    networkWrapperVersion = Uint8Array.from([NetworkWrapperType.EIP4844])
  } else if (networkTxValues.length === 5) {
    ;[txValues, networkWrapperVersion, blobs, kzgCommitments, kzgProofs] =
      networkTxValues as BlobEIP7594NetworkValuesArray
  } else {
    throw Error(`Expected 4 or 5 values in the deserialized network transaction`)
  }

  // Construct the tx but don't freeze yet, we will assign blobs etc once validated
  const decodedTx = createBlob4844TxFromBytesArray(txValues, { ...opts, freeze: false })
  if (decodedTx.to === undefined) {
    throw Error('Blob4844Tx can not be send without a valid `to`')
  }

  const commonCopy = opts.common.copy()
  commonCopy.updateParams(opts.params ?? paramsTx)

  const version = Number(commonCopy.param('blobCommitmentVersionKzg'))
  const blobsHex = blobs.map((blob) => bytesToHex(blob))
  const commsHex = kzgCommitments.map((com) => bytesToHex(com))
  const proofsHex = kzgProofs.map((proof) => bytesToHex(proof))
  const networkWrapperVersionInt = bytesToInt(networkWrapperVersion) as NetworkWrapperType
  if (
    networkWrapperVersionInt !== NetworkWrapperType.EIP4844 &&
    networkWrapperVersionInt !== NetworkWrapperType.EIP7594
  ) {
    throw Error(`Invalid networkWrapperVersion=${networkWrapperVersionInt}`)
  }

  validateBlobTransactionNetworkWrapper(
    networkWrapperVersionInt,
    decodedTx.blobVersionedHashes,
    blobsHex,
    commsHex,
    proofsHex,
    version,
    opts.common.customCrypto.kzg,
  )

  // set the network blob data on the tx
  decodedTx.networkWrapperVersion = networkWrapperVersionInt
  decodedTx.blobs = blobsHex
  decodedTx.kzgCommitments = commsHex
  decodedTx.kzgProofs = proofsHex

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
 * @param txData a {@link Blob4844Tx} containing optional blobs/kzg commitments
 * @param opts - dictionary of {@link TxOptions}
 * @returns the "minimal" representation of a Blob4844Tx (i.e. transaction object minus blobs and kzg commitments)
 */
export function createMinimal4844TxFromNetworkWrapper(
  txData: Blob4844Tx,
  opts?: TxOptions,
): Blob4844Tx {
  if (opts?.common?.customCrypto?.kzg === undefined) {
    throw EthereumJSErrorWithoutCode(
      'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx',
    )
  }

  const tx = createBlob4844Tx(
    {
      ...txData,
      ...{
        networkWrapperVersion: undefined,
        blobs: undefined,
        kzgCommitments: undefined,
        kzgProofs: undefined,
      },
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
 * @returns JSONBlobTxNetworkWrapper with blobs, KZG commitments, and KZG proofs fields
 */
export function blobTxNetworkWrapperToJSON(
  serialized: Uint8Array,
  opts?: TxOptions,
): JSONBlobTxNetworkWrapper {
  const tx = createBlob4844TxFromSerializedNetworkWrapper(serialized, opts)

  const accessListJSON = accessListBytesToJSON(tx.accessList)
  const baseJSON = tx.toJSON()

  return {
    ...baseJSON,
    chainId: bigIntToHex(tx.chainId),
    maxPriorityFeePerGas: bigIntToHex(tx.maxPriorityFeePerGas),
    maxFeePerGas: bigIntToHex(tx.maxFeePerGas),
    accessList: accessListJSON,
    maxFeePerBlobGas: bigIntToHex(tx.maxFeePerBlobGas),
    blobVersionedHashes: tx.blobVersionedHashes,

    networkWrapperVersion: intToHex(tx.networkWrapperVersion!),
    blobs: tx.blobs!,
    kzgCommitments: tx.kzgCommitments!,
    kzgProofs: tx.kzgProofs!,
  }
}
