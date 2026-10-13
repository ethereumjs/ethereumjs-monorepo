[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createMinimal4844TxFromNetworkWrapper

# Function: createMinimal4844TxFromNetworkWrapper()

> **createMinimal4844TxFromNetworkWrapper**(`txData`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L353)

Strip blobs and KZG data from a network-wrapper tx for block inclusion.

## Parameters

### txData

[`Blob4844Tx`](../classes/Blob4844Tx.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

## Throws

If `customCrypto.kzg` is not initialized on [TxOptions.common](../interfaces/TxOptions.md#common)

## Throws

If delegated [createBlob4844Tx](createBlob4844Tx.md) validation fails
