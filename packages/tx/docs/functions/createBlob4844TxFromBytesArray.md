[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromBytesArray

# Function: createBlob4844TxFromBytesArray()

> **createBlob4844TxFromBytesArray**(`values`, `opts`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L193)

Create a Blob4844Tx transaction from an array of byte encoded values ordered according to the devp2p network encoding.
Only canonical format supported, otherwise use `createBlob4844TxFromSerializedNetworkWrapper()`.

## Parameters

### values

`BlobEIP4844TxValuesArray`

Array of byte encoded values containing:
  - `chainId` - Chain ID as Uint8Array
  - `nonce` - Transaction nonce as Uint8Array
  - `maxPriorityFeePerGas` - Maximum priority fee per gas (EIP-1559) as Uint8Array
  - `maxFeePerGas` - Maximum fee per gas (EIP-1559) as Uint8Array
  - `gasLimit` - Gas limit for the transaction as Uint8Array
  - `to` - Recipient address as Uint8Array (optional for contract creation)
  - `value` - Value to transfer in wei as Uint8Array
  - `data` - Transaction data as Uint8Array
  - `accessList` - Access list for EIP-2930 as Uint8Array (optional)
  - `maxFeePerBlobGas` - Maximum fee per blob gas (EIP-4844) as Uint8Array
  - `blobVersionedHashes` - Versioned hashes for blob validation as Uint8Array[]
  - `v` - Signature recovery ID as Uint8Array (for signed transactions)
  - `r` - Signature r component as Uint8Array (for signed transactions)
  - `s` - Signature s component as Uint8Array (for signed transactions)

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

Transaction options including Common instance with KZG initialized

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

A new Blob4844Tx instance

## Throws

If KZG is not initialized in Common

## Throws

If values array length is not 11 (unsigned) or 14 (signed)

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, maxFeePerBlobGas, blobVersionedHashes, v, r, s]`

Notes:
- Requires a Common instance with `customCrypto.kzg` initialized
- Supports both unsigned (11 values) and signed (14 values) transaction formats
- All numeric values must be provided as Uint8Array byte representations
