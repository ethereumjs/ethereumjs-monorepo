[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromBytesArray

# Function: createBlob4844TxFromBytesArray()

> **createBlob4844TxFromBytesArray**(`values`, `opts`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:115](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L115)

Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

## Parameters

### values

`BlobEIP4844TxValuesArray`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)
