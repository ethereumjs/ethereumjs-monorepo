[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844Tx

# Function: createBlob4844Tx()

> **createBlob4844Tx**(`txData`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L125)

Instantiate a Blob4844Tx transaction from a data dictionary.

If blobs are provided the tx will be instantiated in the "Network Wrapper" format,
otherwise in the canonical form represented on-chain.

## Parameters

### txData

[`BlobEIP4844TxData`](../interfaces/BlobEIP4844TxData.md)

Transaction data object containing:
  - `chainId` - Chain ID (will be set automatically if not provided)
  - `nonce` - Transaction nonce
  - `maxPriorityFeePerGas` - Maximum priority fee per gas (EIP-1559)
  - `maxFeePerGas` - Maximum fee per gas (EIP-1559)
  - `gasLimit` - Gas limit for the transaction
  - `to` - Recipient address (optional for contract creation)
  - `value` - Value to transfer in wei
  - `data` - Transaction data
  - `accessList` - Access list for EIP-2930 (optional)
  - `maxFeePerBlobGas` - Maximum fee per blob gas (EIP-4844)
  - `blobVersionedHashes` - Versioned hashes for blob validation
  - `v`, `r`, `s` - Signature components (for signed transactions)
  - `blobs` - Raw blob data (optional, will derive commitments/proofs)
  - `blobsData` - Array of strings to construct blobs from (optional)
  - `kzgCommitments` - KZG commitments (optional, derived from blobs if not provided)
  - `kzgProofs` - KZG proofs (optional, derived from blobs if not provided)
  - `networkWrapperVersion` - Network wrapper version (0=EIP-4844, 1=EIP-7594)

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

Transaction options including Common instance with KZG initialized

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

A new Blob4844Tx instance

## Throws

If KZG is not initialized in Common

## Throws

If both blobsData and blobs are provided

Notes:
- Requires a Common instance with `customCrypto.kzg` initialized
- Cannot provide both `blobsData` and `blobs` simultaneously
- If `blobs` or `blobsData` is provided, `kzgCommitments`, `blobVersionedHashes`, and `kzgProofs` will be automatically derived
- KZG proof type depends on EIP-7594 activation: per-Blob proofs (EIP-4844) or per-Cell proofs (EIP-7594)
