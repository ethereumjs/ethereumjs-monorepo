[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromRPC

# Function: createTxFromRPC()

> **createTxFromRPC**\<`T`\>(`txData`, `txOptions`): `Promise`\<[`Transaction`](../interfaces/Transaction.md)\[`T`\]\>

Defined in: [transactionFactory.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L115)

Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
Note that this normalizes some of the parameters

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md)

## Parameters

### txData

[`TxData`](../interfaces/TxData.md)\[`T`\]

The RPC-encoded data

### txOptions

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

The transaction options

## Returns

`Promise`\<[`Transaction`](../interfaces/Transaction.md)\[`T`\]\>
