[@ethereumjs/tx](../README.md) / TransactionFactory

# Class: TransactionFactory

## Table of contents

### Methods

- [fromBlockBodyData](TransactionFactory.md#fromblockbodydata)
- [fromSerializedData](TransactionFactory.md#fromserializeddata)
- [fromTxData](TransactionFactory.md#fromtxdata)
- [getTransactionClass](TransactionFactory.md#gettransactionclass)

## Methods

### fromBlockBodyData

▸ `Static` **fromBlockBodyData**(`data`, `txOptions?`): [`TypedTransaction`](../README.md#typedtransaction)

When decoding a BlockBody, in the transactions field, a field is either:
A Buffer (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Buffer[] (Legacy Transaction)
This method returns the right transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Buffer` \| `Buffer`[] | A Buffer or Buffer[] |
| `txOptions` | [`TxOptions`](../interfaces/TxOptions.md) | The transaction options |

#### Returns

[`TypedTransaction`](../README.md#typedtransaction)

#### Defined in

[transactionFactory.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L83)

___

### fromSerializedData

▸ `Static` **fromSerializedData**(`data`, `txOptions?`): [`TypedTransaction`](../README.md#typedtransaction)

This method tries to decode serialized data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Buffer` | The data Buffer |
| `txOptions` | [`TxOptions`](../interfaces/TxOptions.md) | The transaction options |

#### Returns

[`TypedTransaction`](../README.md#typedtransaction)

#### Defined in

[transactionFactory.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L49)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`, `txOptions?`): [`TypedTransaction`](../README.md#typedtransaction)

Create a transaction from a `txData` object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txData` | [`TxData`](../README.md#txdata) \| [`AccessListEIP2930TxData`](../interfaces/AccessListEIP2930TxData.md) \| [`FeeMarketEIP1559TxData`](../interfaces/FeeMarketEIP1559TxData.md) | The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction) |
| `txOptions` | [`TxOptions`](../interfaces/TxOptions.md) | Options to pass on to the constructor of the transaction |

#### Returns

[`TypedTransaction`](../README.md#typedtransaction)

#### Defined in

[transactionFactory.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L22)

___

### getTransactionClass

▸ `Static` **getTransactionClass**(`transactionID?`, `_common?`): typeof [`Transaction`](Transaction.md) \| typeof [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| typeof [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

This helper method allows one to retrieve the class which matches the transactionID
If transactionID is undefined, returns the legacy transaction class.

**`deprecated`** - This method is deprecated and will be removed on the next major release

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `transactionID` | `number` | `0` |  |
| `_common?` | `default` | `undefined` | This option is not used |

#### Returns

typeof [`Transaction`](Transaction.md) \| typeof [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| typeof [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Defined in

[transactionFactory.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L101)
