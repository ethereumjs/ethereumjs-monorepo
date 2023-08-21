[@ethereumjs/tx](../README.md) / TransactionFactory

# Class: TransactionFactory

## Table of contents

### Methods

- [fromBlockBodyData](TransactionFactory.md#fromblockbodydata)
- [fromJsonRpcProvider](TransactionFactory.md#fromjsonrpcprovider)
- [fromRPC](TransactionFactory.md#fromrpc)
- [fromSerializedData](TransactionFactory.md#fromserializeddata)
- [fromTxData](TransactionFactory.md#fromtxdata)

## Methods

### fromBlockBodyData

▸ `Static` **fromBlockBodyData**(`data`, `txOptions?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md)

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` \| `Uint8Array`[] | A Uint8Array or Uint8Array[] |
| `txOptions` | [`TxOptions`](../interfaces/TxOptions.md) | The transaction options |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md)

#### Defined in

[tx/src/transactionFactory.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L87)

___

### fromJsonRpcProvider

▸ `Static` **fromJsonRpcProvider**(`provider`, `txHash`, `txOptions?`): `Promise`<[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md)\>

Method to retrieve a transaction from the provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `string` \| `EthersProvider` | a url string for a JSON-RPC provider or an Ethers JsonRPCProvider object |
| `txHash` | `string` | Transaction hash |
| `txOptions?` | [`TxOptions`](../interfaces/TxOptions.md) | The transaction options |

#### Returns

`Promise`<[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md)\>

the transaction specified by `txHash`

#### Defined in

[tx/src/transactionFactory.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L105)

___

### fromRPC

▸ `Static` **fromRPC**<`T`\>(`txData`, `txOptions?`): `Promise`<[`Transaction`](../interfaces/Transaction.md)[`T`]\>

Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
Note that this normalizes some of the parameters

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txData` | [`TxData`](../interfaces/TxData.md)[`T`] | The RPC-encoded data |
| `txOptions` | [`TxOptions`](../interfaces/TxOptions.md) | The transaction options |

#### Returns

`Promise`<[`Transaction`](../interfaces/Transaction.md)[`T`]\>

#### Defined in

[tx/src/transactionFactory.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L128)

___

### fromSerializedData

▸ `Static` **fromSerializedData**<`T`\>(`data`, `txOptions?`): [`Transaction`](../interfaces/Transaction.md)[`T`]

This method tries to decode serialized data.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data Uint8Array |
| `txOptions` | [`TxOptions`](../interfaces/TxOptions.md) | The transaction options |

#### Returns

[`Transaction`](../interfaces/Transaction.md)[`T`]

#### Defined in

[tx/src/transactionFactory.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L57)

___

### fromTxData

▸ `Static` **fromTxData**<`T`\>(`txData`, `txOptions?`): [`Transaction`](../interfaces/Transaction.md)[`T`]

Create a transaction from a `txData` object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txData` | [`TypedTxData`](../README.md#typedtxdata) | The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction) |
| `txOptions` | [`TxOptions`](../interfaces/TxOptions.md) | Options to pass on to the constructor of the transaction |

#### Returns

[`Transaction`](../interfaces/Transaction.md)[`T`]

#### Defined in

[tx/src/transactionFactory.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L29)
