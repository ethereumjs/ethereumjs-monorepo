[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createTxFromJSONRPCProvider

# Function: createTxFromJSONRPCProvider()

> **createTxFromJSONRPCProvider**(`provider`, `txHash`, `txOptions?`): `Promise`\<[`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md)\>

Defined in: [transactionFactory.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L129)

Method to retrieve a transaction from the provider

## Parameters

### provider

a url string for a JSON-RPC provider or an Ethers JSONRPCProvider object

`string` | `EthersProvider`

### txHash

`string`

Transaction hash

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

## Returns

`Promise`\<[`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Tx`](../classes/AccessList2930Tx.md) \| [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| [`EOACode7702Tx`](../classes/EOACode7702Tx.md)\>

the transaction specified by `txHash`
