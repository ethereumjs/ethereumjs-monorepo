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
 * Instantiate a {@link Blob4844Tx} from a plain data object.
 *
 * With `blobs` or `blobsData` present the tx is built in network-wrapper form;
 * otherwise the on-chain canonical form (versioned hashes only) is used.
 *
 * Requires `opts.common.customCrypto.kzg`. When blobs are supplied, commitments,
 * versioned hashes, and proofs are derived automatically.
 *
 * @throws If `customCrypto.kzg` is not initialized on {@link TxOptions.common}
 * @throws If both `blobsData` and `blobs` are provided
 * @throws If fee or value fields overflow or are non-numeric
 * @throws If gas limit or nonce exceed EIP bounds
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
 * Instantiate a {@link Blob4844Tx} from devp2p byte-array encoding (canonical form only).
 *
 * For network-wrapper blobs use {@link createBlob4844TxFromSerializedNetworkWrapper}.
 *
 * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, maxFeePerBlobGas, blobVersionedHashes, v, r, s]`
 *
 * @throws If `customCrypto.kzg` is not initialized on {@link TxOptions.common}
 * @throws If the values array length is not 11 (unsigned) or 14 (signed)
 * @throws If `chainId` or signature fields are nested arrays
 * @throws If numeric fields contain leading zeroes
 * @throws If constructor validation fails (see {@link createBlob4844Tx})
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
 * Instantiate a {@link Blob4844Tx} from RLP-serialized bytes (canonical form only).
 *
 * Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
 * access_list, max_fee_per_blob_gas, blob_versioned_hashes, y_parity, r, s])`
 *
 * @throws If `customCrypto.kzg` is not initialized on {@link TxOptions.common}
 * @throws If the leading type byte is not `0x03`
 * @throws If RLP decode result is not an array
 * @throws If decoded values fail {@link createBlob4844TxFromBytesArray} checks
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
 * Instantiate a {@link Blob4844Tx} from a network-wrapper RLP payload (blobs + KZG proofs).
 *
 * EIP-4844: `0x03 || rlp([tx_values, blobs, kzg_commitments, kzg_proofs])`
 * EIP-7594: `0x03 || rlp([tx_values, network_wrapper_version, blobs, kzg_commitments, kzg_proofs])`
 *
 * @throws If {@link TxOptions.common} is missing
 * @throws If `customCrypto.kzg` is not initialized
 * @throws If the leading type byte is not `0x03`
 * @throws If the wrapper has other than 4 or 5 RLP elements
 * @throws If the decoded tx has no `to` address
 * @throws If the network wrapper version is invalid
 * @throws If KZG proof verification fails
 * @throws If versioned hashes do not match commitments
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
 * Strip blobs and KZG data from a network-wrapper tx for block inclusion.
 *
 * @throws If `customCrypto.kzg` is not initialized on {@link TxOptions.common}
 * @throws If delegated {@link createBlob4844Tx} validation fails
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
 * Decode a blob network wrapper and return its JSON representation including blobs and proofs.
 *
 * @throws If {@link createBlob4844TxFromSerializedNetworkWrapper} validation fails
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
