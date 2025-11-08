[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createMinimal4844TxFromNetworkWrapper

# Function: createMinimal4844TxFromNetworkWrapper()

> **createMinimal4844TxFromNetworkWrapper**(`txData`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L418)

Creates the minimal representation of a blob transaction from the network wrapper version.
The minimal representation is used when adding transactions to an execution payload/block

## Parameters

### txData

[`Blob4844Tx`](../classes/Blob4844Tx.md)

a [Blob4844Tx](../classes/Blob4844Tx.md) containing optional blobs/kzg commitments

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

dictionary of [TxOptions](../interfaces/TxOptions.md)

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

the "minimal" representation of a Blob4844Tx (i.e. transaction object minus blobs and kzg commitments)
