[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromBlockBodyData

# Function: createTxFromBlockBodyData()

> **createTxFromBlockBodyData**(`data`, `txOptions?`): [`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [transactionFactory.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L93)

Decode a transaction from block-body RLP (typed bytes or legacy value array).

## Parameters

### data

`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md)

## Throws

If `data` is neither a `Uint8Array` nor a `Uint8Array[]`

## Throws

If delegated factory validation fails
