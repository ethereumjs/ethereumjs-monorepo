[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromJSONRPCProvider

# Function: createTxFromJSONRPCProvider()

> **createTxFromJSONRPCProvider**(`provider`, `txHash`, `txOptions?`): `Promise`\<[`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md)\>

Defined in: [transactionFactory.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L127)

Fetch a transaction by hash from a JSON-RPC provider and instantiate it.

## Parameters

### provider

`string` \| `EthersProvider`

### txHash

`string`

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

`Promise`\<[`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md)\>

## Throws

If the provider returns no data for the hash

## Throws

If delegated [createTxFromRPC](createTxFromRPC.md) validation fails
