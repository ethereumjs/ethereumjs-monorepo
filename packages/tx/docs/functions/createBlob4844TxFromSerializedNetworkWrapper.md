[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromSerializedNetworkWrapper

# Function: createBlob4844TxFromSerializedNetworkWrapper()

> **createBlob4844TxFromSerializedNetworkWrapper**(`serialized`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L229)

Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)

## Parameters

### serialized

`Uint8Array`

a buffer representing a serialized BlobTransactionNetworkWrapper

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

any TxOptions defined

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

a Blob4844Tx
