[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTx

# Function: createTx()

> **createTx**\<`T`\>(`txData`, `txOptions?`): [`Transaction`](../interfaces/Transaction.md)\[`T`\]

Defined in: [transactionFactory.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L32)

Instantiate a transaction; the `type` field selects the concrete [TypedTransaction](../type-aliases/TypedTransaction.md) class.

When `type` is omitted a legacy transaction is created.

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md)

## Parameters

### txData

[`TypedTxData`](../type-aliases/TypedTxData.md)

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`Transaction`](../interfaces/Transaction.md)\[`T`\]

## Throws

If the `type` field is not supported

## Throws

If delegated type-specific factory validation fails
