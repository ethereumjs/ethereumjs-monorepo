[@ethereumjs/tx](../README.md) / [baseTransaction](../modules/basetransaction.md) / BaseTransaction

# Class: BaseTransaction<TransactionObject\>

[baseTransaction](../modules/basetransaction.md).BaseTransaction

This base class will likely be subject to further
refactoring along the introduction of additional tx types
on the Ethereum network.

It is therefore not recommended to use directly.

## Type parameters

| Name |
| :------ |
| `TransactionObject` |

## Hierarchy

- **BaseTransaction**

  ↳ [*default*](eip1559transaction.default.md)

  ↳ [*default*](eip2930transaction.default.md)

  ↳ [*default*](legacytransaction.default.md)

## Table of contents

### Constructors

- [constructor](basetransaction.basetransaction-1.md#constructor)

### Properties

- [common](basetransaction.basetransaction-1.md#common)
- [data](basetransaction.basetransaction-1.md#data)
- [gasLimit](basetransaction.basetransaction-1.md#gaslimit)
- [nonce](basetransaction.basetransaction-1.md#nonce)
- [r](basetransaction.basetransaction-1.md#r)
- [s](basetransaction.basetransaction-1.md#s)
- [to](basetransaction.basetransaction-1.md#to)
- [v](basetransaction.basetransaction-1.md#v)
- [value](basetransaction.basetransaction-1.md#value)

### Accessors

- [transactionType](basetransaction.basetransaction-1.md#transactiontype)
- [type](basetransaction.basetransaction-1.md#type)

### Methods

- [getBaseFee](basetransaction.basetransaction-1.md#getbasefee)
- [getDataFee](basetransaction.basetransaction-1.md#getdatafee)
- [getMessageToSign](basetransaction.basetransaction-1.md#getmessagetosign)
- [getMessageToVerifySignature](basetransaction.basetransaction-1.md#getmessagetoverifysignature)
- [getSenderAddress](basetransaction.basetransaction-1.md#getsenderaddress)
- [getSenderPublicKey](basetransaction.basetransaction-1.md#getsenderpublickey)
- [getUpfrontCost](basetransaction.basetransaction-1.md#getupfrontcost)
- [hash](basetransaction.basetransaction-1.md#hash)
- [isSigned](basetransaction.basetransaction-1.md#issigned)
- [raw](basetransaction.basetransaction-1.md#raw)
- [serialize](basetransaction.basetransaction-1.md#serialize)
- [sign](basetransaction.basetransaction-1.md#sign)
- [toCreationAddress](basetransaction.basetransaction-1.md#tocreationaddress)
- [toJSON](basetransaction.basetransaction-1.md#tojson)
- [validate](basetransaction.basetransaction-1.md#validate)
- [verifySignature](basetransaction.basetransaction-1.md#verifysignature)

## Constructors

### constructor

\+ **new BaseTransaction**<TransactionObject\>(`txData`: [*TxData*](../modules/types.md#txdata) \| [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md) \| [*FeeMarketEIP1559TxData*](../interfaces/types.feemarketeip1559txdata.md), `txOptions?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*BaseTransaction*](basetransaction.basetransaction-1.md)<TransactionObject\>

#### Type parameters

| Name |
| :------ |
| `TransactionObject` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `txData` | [*TxData*](../modules/types.md#txdata) \| [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md) \| [*FeeMarketEIP1559TxData*](../interfaces/types.feemarketeip1559txdata.md) | - |
| `txOptions` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*BaseTransaction*](basetransaction.basetransaction-1.md)<TransactionObject\>

Defined in: [baseTransaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L42)

## Properties

### common

• `Readonly` **common**: *default*

Defined in: [baseTransaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L38)

___

### data

• `Readonly` **data**: *Buffer*

Defined in: [baseTransaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L37)

___

### gasLimit

• `Readonly` **gasLimit**: *BN*

Defined in: [baseTransaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L34)

___

### nonce

• `Readonly` **nonce**: *BN*

Defined in: [baseTransaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L33)

___

### r

• `Optional` `Readonly` **r**: *BN*

Defined in: [baseTransaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L41)

___

### s

• `Optional` `Readonly` **s**: *BN*

Defined in: [baseTransaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L42)

___

### to

• `Optional` `Readonly` **to**: *Address*

Defined in: [baseTransaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L35)

___

### v

• `Optional` `Readonly` **v**: *BN*

Defined in: [baseTransaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L40)

___

### value

• `Readonly` **value**: *BN*

Defined in: [baseTransaction.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L36)

## Accessors

### transactionType

• get **transactionType**(): *number*

Alias for `type`

**`deprecated`** Use `type` instead

**Returns:** *number*

Defined in: [baseTransaction.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L82)

___

### type

• get **type**(): *number*

Returns the transaction type.

Note: legacy txs will return tx type `0`.

**Returns:** *number*

Defined in: [baseTransaction.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L91)

## Methods

### getBaseFee

▸ **getBaseFee**(): *BN*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

Defined in: [baseTransaction.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L119)

___

### getDataFee

▸ **getDataFee**(): *BN*

The amount of gas paid for the data in this tx

**Returns:** *BN*

Defined in: [baseTransaction.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L130)

___

### getMessageToSign

▸ `Abstract` **getMessageToSign**(`hashMessage`: ``false``): *Buffer* \| *Buffer*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage` | ``false`` |

**Returns:** *Buffer* \| *Buffer*[]

Defined in: [baseTransaction.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L167)

▸ `Abstract` **getMessageToSign**(`hashMessage?`: ``true``): *Buffer*

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage?` | ``true`` |

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L168)

___

### getMessageToVerifySignature

▸ `Abstract` **getMessageToVerifySignature**(): *Buffer*

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L172)

___

### getSenderAddress

▸ **getSenderAddress**(): *Address*

Returns the sender's address

**Returns:** *Address*

Defined in: [baseTransaction.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L207)

___

### getSenderPublicKey

▸ `Abstract` **getSenderPublicKey**(): *Buffer*

Returns the public key of the sender

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L214)

___

### getUpfrontCost

▸ `Abstract` **getUpfrontCost**(): *BN*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

Defined in: [baseTransaction.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L144)

___

### hash

▸ `Abstract` **hash**(): *Buffer*

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L170)

___

### isSigned

▸ **isSigned**(): *boolean*

**Returns:** *boolean*

Defined in: [baseTransaction.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L174)

___

### raw

▸ `Abstract` **raw**(): [*TxValuesArray*](../modules/types.md#txvaluesarray) \| [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray) \| [*FeeMarketEIP1559ValuesArray*](../modules/types.md#feemarketeip1559valuesarray)

Returns a Buffer Array of the raw Buffers of this transaction, in order.

**Returns:** [*TxValuesArray*](../modules/types.md#txvaluesarray) \| [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray) \| [*FeeMarketEIP1559ValuesArray*](../modules/types.md#feemarketeip1559valuesarray)

Defined in: [baseTransaction.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L156)

___

### serialize

▸ `Abstract` **serialize**(): *Buffer*

Returns the encoding of the transaction.

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L161)

___

### sign

▸ **sign**(`privateKey`: *Buffer*): TransactionObject

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | *Buffer* |

**Returns:** TransactionObject

Defined in: [baseTransaction.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L225)

___

### toCreationAddress

▸ **toCreationAddress**(): *boolean*

If the tx's `to` is to the creation address

**Returns:** *boolean*

Defined in: [baseTransaction.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L149)

___

### toJSON

▸ `Abstract` **toJSON**(): [*JsonTx*](../interfaces/types.jsontx.md)

Returns an object with the JSON representation of the transaction

**Returns:** [*JsonTx*](../interfaces/types.jsontx.md)

Defined in: [baseTransaction.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L237)

___

### validate

▸ **validate**(): *boolean*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

Defined in: [baseTransaction.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L99)

▸ **validate**(`stringError`: ``false``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

**Returns:** *boolean*

Defined in: [baseTransaction.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L100)

▸ **validate**(`stringError`: ``true``): *string*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

**Returns:** *string*[]

Defined in: [baseTransaction.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L101)

___

### verifySignature

▸ **verifySignature**(): *boolean*

Determines if the signature is valid

**Returns:** *boolean*

Defined in: [baseTransaction.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L194)
