[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromRLP

# Function: createTxFromRLP()

> **createTxFromRLP**\<`T`\>(`data`, `txOptions`): [`Transaction`](../interfaces/Transaction.md)\[`T`\]

Defined in: [transactionFactory.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L62)

This method tries to decode serialized data.

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md)

## Parameters

### data

`Uint8Array`

The data Uint8Array

### txOptions

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

The transaction options

## Returns

[`Transaction`](../interfaces/Transaction.md)\[`T`\]
