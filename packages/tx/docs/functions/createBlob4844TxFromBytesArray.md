[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromBytesArray

# Function: createBlob4844TxFromBytesArray()

> **createBlob4844TxFromBytesArray**(`values`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L152)

Instantiate a [Blob4844Tx](../classes/Blob4844Tx.md) from devp2p byte-array encoding (canonical form only).

For network-wrapper blobs use [createBlob4844TxFromSerializedNetworkWrapper](createBlob4844TxFromSerializedNetworkWrapper.md).

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, maxFeePerBlobGas, blobVersionedHashes, v, r, s]`

## Parameters

### values

`BlobEIP4844TxValuesArray`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

## Throws

If `customCrypto.kzg` is not initialized on [TxOptions.common](../interfaces/TxOptions.md#common)

## Throws

If the values array length is not 11 (unsigned) or 14 (signed)

## Throws

If `chainId` or signature fields are nested arrays

## Throws

If numeric fields contain leading zeroes

## Throws

If constructor validation fails (see [createBlob4844Tx](createBlob4844Tx.md))
