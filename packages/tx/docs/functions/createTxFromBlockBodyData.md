[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromBlockBodyData

# Function: createTxFromBlockBodyData()

> **createTxFromBlockBodyData**(`data`, `txOptions`): [`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md)

Defined in: [transactionFactory.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L94)

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

## Parameters

### data

A Uint8Array or Uint8Array[]

`Uint8Array`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\>[]

### txOptions

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

The transaction options

## Returns

[`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md)
