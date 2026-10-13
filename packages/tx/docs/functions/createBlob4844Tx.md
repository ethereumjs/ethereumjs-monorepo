[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844Tx

# Function: createBlob4844Tx()

> **createBlob4844Tx**(`txData`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L103)

Instantiate a [Blob4844Tx](../classes/Blob4844Tx.md) from a plain data object.

With `blobs` or `blobsData` present the tx is built in network-wrapper form;
otherwise the on-chain canonical form (versioned hashes only) is used.

Requires `opts.common.customCrypto.kzg`. When blobs are supplied, commitments,
versioned hashes, and proofs are derived automatically.

## Parameters

### txData

[`BlobEIP4844TxData`](../interfaces/BlobEIP4844TxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

## Throws

If `customCrypto.kzg` is not initialized on [TxOptions.common](../interfaces/TxOptions.md#common)

## Throws

If both `blobsData` and `blobs` are provided

## Throws

If fee or value fields overflow or are non-numeric

## Throws

If gas limit or nonce exceed EIP bounds
