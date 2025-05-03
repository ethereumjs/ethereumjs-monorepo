[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844Tx

# Function: createBlob4844Tx()

> **createBlob4844Tx**(`txData`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L80)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
v, r, s, blobs, kzgCommitments, blobVersionedHashes, kzgProofs }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values
- `blobs` cannot be supplied as well as `kzgCommitments`, `blobVersionedHashes`, `kzgProofs`
- If `blobs` is passed in,  `kzgCommitments`, `blobVersionedHashes`, `kzgProofs` will be derived by the constructor

## Parameters

### txData

[`BlobEIP4844TxData`](../interfaces/BlobEIP4844TxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)
