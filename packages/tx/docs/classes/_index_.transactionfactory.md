[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [TransactionFactory](_index_.transactionfactory.md)

# Class: TransactionFactory

## Hierarchy

* **TransactionFactory**

## Index

### Methods

* [fromBlockBodyData](_index_.transactionfactory.md#static-fromblockbodydata)
* [fromSerializedData](_index_.transactionfactory.md#static-fromserializeddata)
* [fromTxData](_index_.transactionfactory.md#static-fromtxdata)
* [getTransactionClass](_index_.transactionfactory.md#static-gettransactionclass)

## Methods

### `Static` fromBlockBodyData

▸ **fromBlockBodyData**(`data`: Buffer | Buffer[], `txOptions`: [TxOptions](../interfaces/_index_.txoptions.md)): *[AccessListEIP2930Transaction](_eip2930transaction_.accesslisteip2930transaction.md)‹› | [Transaction](_index_.transaction.md)‹›*

*Defined in [transactionFactory.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L80)*

When decoding a BlockBody, in the transactions field, a field is either:
A Buffer (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Buffer[] (Legacy Transaction)
This method returns the right transaction.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`data` | Buffer &#124; Buffer[] | - | A Buffer or Buffer[] |
`txOptions` | [TxOptions](../interfaces/_index_.txoptions.md) | {} | The transaction options  |

**Returns:** *[AccessListEIP2930Transaction](_eip2930transaction_.accesslisteip2930transaction.md)‹› | [Transaction](_index_.transaction.md)‹›*

___

### `Static` fromSerializedData

▸ **fromSerializedData**(`data`: Buffer, `txOptions`: [TxOptions](../interfaces/_index_.txoptions.md)): *[TypedTransaction](../modules/_index_.md#typedtransaction)*

*Defined in [transactionFactory.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L42)*

This method tries to decode serialized data.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`data` | Buffer | - | The data Buffer |
`txOptions` | [TxOptions](../interfaces/_index_.txoptions.md) | {} | The transaction options  |

**Returns:** *[TypedTransaction](../modules/_index_.md#typedtransaction)*

___

### `Static` fromTxData

▸ **fromTxData**(`txData`: [TxData](../modules/_index_.md#txdata) | [AccessListEIP2930TxData](../interfaces/_index_.accesslisteip2930txdata.md), `txOptions`: [TxOptions](../interfaces/_index_.txoptions.md)): *[TypedTransaction](../modules/_index_.md#typedtransaction)*

*Defined in [transactionFactory.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L19)*

Create a transaction from a `txData` object

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`txData` | [TxData](../modules/_index_.md#txdata) &#124; [AccessListEIP2930TxData](../interfaces/_index_.accesslisteip2930txdata.md) | - | The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction) |
`txOptions` | [TxOptions](../interfaces/_index_.txoptions.md) | {} | Options to pass on to the constructor of the transaction  |

**Returns:** *[TypedTransaction](../modules/_index_.md#typedtransaction)*

___

### `Static` getTransactionClass

▸ **getTransactionClass**(`transactionID`: number, `common?`: Common): *[AccessListEIP2930Transaction](_eip2930transaction_.accesslisteip2930transaction.md) | [Transaction](_index_.transaction.md)*

*Defined in [transactionFactory.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L98)*

This helper method allows one to retrieve the class which matches the transactionID
If transactionID is undefined, returns the legacy transaction class.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`transactionID` | number | 0 | - |
`common?` | Common | - |   |

**Returns:** *[AccessListEIP2930Transaction](_eip2930transaction_.accesslisteip2930transaction.md) | [Transaction](_index_.transaction.md)*
