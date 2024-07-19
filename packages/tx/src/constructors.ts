import { RLP } from '@ethereumjs/rlp'
import {
  blobsToCommitments,
  blobsToProofs,
  bytesToBigInt,
  bytesToHex,
  commitmentsToVersionedHashes,
  equalsBytes,
  getBlobs,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'

import { TransactionType } from './types.js'
import { _validateNotArray, txTypeBytes } from './util.js'

import {
  AccessListEIP2930Transaction,
  BlobEIP4844Transaction,
  EOACodeEIP7702Transaction,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
} from './index.js'

import type { AccessList, TxData, TxOptions, TxValuesArray } from './types.js'

export const txFromTxData = {
  LegacyTransaction: (
    txData: TxData[TransactionType.Legacy],
    opts: TxOptions = {}
  ): LegacyTransaction => {
    return new LegacyTransaction(txData, opts)
  },
  FeeMarketEIP1559Transaction: (
    txData: TxData[TransactionType.FeeMarketEIP1559],
    opts: TxOptions = {}
  ): FeeMarketEIP1559Transaction => {
    return new FeeMarketEIP1559Transaction(txData, opts)
  },
  AccessListEIP2930Transaction: (
    txData: TxData[TransactionType.AccessListEIP2930],
    opts: TxOptions = {}
  ): AccessListEIP2930Transaction => {
    return new AccessListEIP2930Transaction(txData, opts)
  },
  EOACodeEIP7702Transaction: (
    txData: TxData[TransactionType.EOACodeEIP7702],
    opts: TxOptions = {}
  ): EOACodeEIP7702Transaction => {
    return new EOACodeEIP7702Transaction(txData, opts)
  },
  BlobEIP4844Transaction: (
    txData: TxData[TransactionType.BlobEIP4844],
    opts: TxOptions = {}
  ): BlobEIP4844Transaction => {
    if (opts?.common?.customCrypto?.kzg === undefined) {
      throw new Error(
        'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx'
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
      txData.blobVersionedHashes = commitmentsToVersionedHashes(
        txData.kzgCommitments as Uint8Array[]
      )
      txData.kzgProofs = blobsToProofs(
        kzg,
        txData.blobs as Uint8Array[],
        txData.kzgCommitments as Uint8Array[]
      )
    }
    return new BlobEIP4844Transaction(txData, opts)
  },
}

// From Values Array

export const txFromValuesArray = {
  LegacyTransaction: (values: TxValuesArray[TransactionType.Legacy], opts: TxOptions = {}) => {
    // If length is not 6, it has length 9. If v/r/s are empty Uint8Arrays, it is still an unsigned transaction
    // This happens if you get the RLP data from `raw()`
    if (values.length !== 6 && values.length !== 9) {
      throw new Error(
        'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).'
      )
    }
    const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values
    validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })
    return new LegacyTransaction(
      {
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        v,
        r,
        s,
      },
      opts
    )
  },
  FeeMarketEIP1559Transaction: (
    values: TxValuesArray[TransactionType.FeeMarketEIP1559],
    opts: TxOptions = {}
  ) => {
    if (values.length !== 9 && values.length !== 12) {
      throw new Error(
        'Invalid EIP-1559 transaction. Only expecting 9 values (for unsigned tx) or 12 values (for signed tx).'
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
      v,
      r,
      s,
    ] = values

    _validateNotArray({ chainId, v })
    validateNoLeadingZeroes({ nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, value, v, r, s })

    return new FeeMarketEIP1559Transaction(
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
        v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
        r,
        s,
      },
      opts
    )
  },
  EOACodeEIP7702Transaction: (
    values: TxValuesArray[TransactionType.EOACodeEIP7702],
    opts: TxOptions = {}
  ) => {
    if (values.length !== 10 && values.length !== 13) {
      throw new Error(
        'Invalid EIP-7702 transaction. Only expecting 10 values (for unsigned tx) or 13 values (for signed tx).'
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
      authorityList,
      v,
      r,
      s,
    ] = values

    _validateNotArray({ chainId, v })
    validateNoLeadingZeroes({ nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, value, v, r, s })

    return new EOACodeEIP7702Transaction(
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
        authorizationList: authorityList ?? [],
        v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
        r,
        s,
      },
      opts
    )
  },
  AccessListEIP2930Transaction: (
    values: TxValuesArray[TransactionType.AccessListEIP2930],
    opts: TxOptions = {}
  ) => {
    if (values.length !== 8 && values.length !== 11) {
      throw new Error(
        'Invalid EIP-2930 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).'
      )
    }
    const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s] = values
    _validateNotArray({ chainId, v })
    validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })
    const emptyAccessList: AccessList = []
    return new AccessListEIP2930Transaction(
      {
        chainId: bytesToBigInt(chainId),
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        accessList: accessList ?? emptyAccessList,
        v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
        r,
        s,
      },
      opts
    )
  },
  BlobEIP4844Transaction: (
    values: TxValuesArray[TransactionType.BlobEIP4844],
    opts: TxOptions = {}
  ) => {
    if (opts.common?.customCrypto?.kzg === undefined) {
      throw new Error(
        'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx'
      )
    }

    if (values.length !== 11 && values.length !== 14) {
      throw new Error(
        'Invalid EIP-4844 transaction. Only expecting 11 values (for unsigned tx) or 14 values (for signed tx).'
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

    _validateNotArray({ chainId, v })
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
      opts
    )
  },
}

// From Serialized TX

export const txFromSerializedTx = {
  LegacyTransaction: (serialized: Uint8Array, opts: TxOptions = {}) => {
    const values = RLP.decode(serialized) as TxValuesArray[TransactionType.Legacy]
    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }
    return txFromValuesArray.LegacyTransaction(values, opts)
  },
  FeeMarketEIP1559Transaction: (serialized: Uint8Array, opts: TxOptions = {}) => {
    if (
      equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.FeeMarketEIP1559)) ===
      false
    ) {
      throw new Error(
        `Invalid serialized tx input: not an EIP-1559 transaction (wrong tx type, expected: ${
          TransactionType.FeeMarketEIP1559
        }, received: ${bytesToHex(serialized.subarray(0, 1))}`
      )
    }
    const values = RLP.decode(serialized.subarray(1))
    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input: must be array')
    }
    return txFromValuesArray.FeeMarketEIP1559Transaction(
      values as TxValuesArray[TransactionType.FeeMarketEIP1559],
      opts
    )
  },
  EOACodeEIP7702Transaction: (serialized: Uint8Array, opts: TxOptions = {}) => {
    if (
      equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.EOACodeEIP7702)) === false
    ) {
      throw new Error(
        `Invalid serialized tx input: not an EIP-7702 transaction (wrong tx type, expected: ${
          TransactionType.EOACodeEIP7702
        }, received: ${bytesToHex(serialized.subarray(0, 1))}`
      )
    }
    const values = RLP.decode(serialized.subarray(1))
    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input: must be array')
    }
    return txFromValuesArray.EOACodeEIP7702Transaction(
      values as TxValuesArray[TransactionType.EOACodeEIP7702],
      opts
    )
  },
  AccessListEIP2930Transaction: (serialized: Uint8Array, opts: TxOptions = {}) => {
    if (
      equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.AccessListEIP2930)) ===
      false
    ) {
      throw new Error(
        `Invalid serialized tx input: not an EIP-2930 transaction (wrong tx type, expected: ${
          TransactionType.AccessListEIP2930
        }, received: ${bytesToHex(serialized.subarray(0, 1))}`
      )
    }
    const values = RLP.decode(Uint8Array.from(serialized.subarray(1)))
    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input: must be array')
    }
    return txFromValuesArray.AccessListEIP2930Transaction(
      values as TxValuesArray[TransactionType.AccessListEIP2930],
      opts
    )
  },
  BlobEIP4844Transaction: (serialized: Uint8Array, opts: TxOptions = {}) => {
    if (opts.common?.customCrypto?.kzg === undefined) {
      throw new Error(
        'A common object with customCrypto.kzg initialized required to instantiate a 4844 blob tx'
      )
    }

    if (
      equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.BlobEIP4844)) === false
    ) {
      throw new Error(
        `Invalid serialized tx input: not an EIP-4844 transaction (wrong tx type, expected: ${
          TransactionType.BlobEIP4844
        }, received: ${bytesToHex(serialized.subarray(0, 1))}`
      )
    }

    const values = RLP.decode(serialized.subarray(1))

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input: must be array')
    }

    return txFromValuesArray.BlobEIP4844Transaction(
      values as TxValuesArray[TransactionType.BlobEIP4844],
      opts
    )
  },
}
