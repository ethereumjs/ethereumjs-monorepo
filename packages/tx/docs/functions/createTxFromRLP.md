[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromRLP

# Function: createTxFromRLP()

> **createTxFromRLP**\<`T`\>(`data`, `txOptions?`): [`Transaction`](../interfaces/Transaction.md)\[`T`\]

Defined in: [transactionFactory.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L64)

Decode an RLP-serialized transaction (legacy or EIP-2718 typed).

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md)

## Parameters

### data

`Uint8Array`

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`Transaction`](../interfaces/Transaction.md)\[`T`\]

## Throws

If the typed tx ID is unknown

## Throws

If delegated type-specific factory validation fails
