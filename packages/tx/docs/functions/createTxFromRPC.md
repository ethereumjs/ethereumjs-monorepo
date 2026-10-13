[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromRPC

# Function: createTxFromRPC()

> **createTxFromRPC**\<`T`\>(`txData`, `txOptions?`): `Promise`\<[`Transaction`](../interfaces/Transaction.md)\[`T`\]\>

Defined in: [transactionFactory.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L114)

Instantiate a transaction from JSON-RPC fields (`eth_getTransactionByHash` shape).

Numeric and hex fields are normalized before construction.

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md)

## Parameters

### txData

[`TxData`](../interfaces/TxData.md)\[`T`\]

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

`Promise`\<[`Transaction`](../interfaces/Transaction.md)\[`T`\]\>

## Throws

If delegated [createTx](createTx.md) validation fails
