[@ethereumjs/tx](../README.md) / [baseTransaction](../modules/basetransaction.md) / BaseTransaction

# Class: BaseTransaction<TransactionObject\>

[baseTransaction](../modules/basetransaction.md).BaseTransaction

This base class will likely be subject to further
refactoring along the introduction of additional tx types
on the Ethereum network.

It is therefore not recommended to use directly.

## Type parameters

Name |
:------ |
`TransactionObject` |

## Hierarchy

* **BaseTransaction**

  ↳ [*default*](eip2930transaction.default.md)

  ↳ [*default*](legacytransaction.default.md)

## Table of contents

### Constructors

- [constructor](basetransaction.basetransaction-1.md#constructor)

### Properties

- [common](basetransaction.basetransaction-1.md#common)
- [data](basetransaction.basetransaction-1.md#data)
- [gasLimit](basetransaction.basetransaction-1.md#gaslimit)
- [gasPrice](basetransaction.basetransaction-1.md#gasprice)
- [nonce](basetransaction.basetransaction-1.md#nonce)
- [r](basetransaction.basetransaction-1.md#r)
- [s](basetransaction.basetransaction-1.md#s)
- [to](basetransaction.basetransaction-1.md#to)
- [v](basetransaction.basetransaction-1.md#v)
- [value](basetransaction.basetransaction-1.md#value)

### Accessors

- [senderR](basetransaction.basetransaction-1.md#senderr)
- [senderS](basetransaction.basetransaction-1.md#senders)
- [transactionType](basetransaction.basetransaction-1.md#transactiontype)
- [type](basetransaction.basetransaction-1.md#type)
- [yParity](basetransaction.basetransaction-1.md#yparity)

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

\+ **new BaseTransaction**<TransactionObject\>(`txData`: [*TxData*](../modules/types.md#txdata) \| [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md), `txOptions?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*BaseTransaction*](basetransaction.basetransaction-1.md)<TransactionObject\>

#### Type parameters:

Name |
:------ |
`TransactionObject` |

#### Parameters:

Name | Type |
:------ | :------ |
`txData` | [*TxData*](../modules/types.md#txdata) \| [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md) |
`txOptions` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*BaseTransaction*](basetransaction.basetransaction-1.md)<TransactionObject\>

Defined in: [baseTransaction.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L39)

## Properties

### common

• `Readonly` **common**: *default*

Defined in: [baseTransaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L35)

___

### data

• `Readonly` **data**: *Buffer*

Defined in: [baseTransaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L34)

___

### gasLimit

• `Readonly` **gasLimit**: *BN*

Defined in: [baseTransaction.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L30)

___

### gasPrice

• `Readonly` **gasPrice**: *BN*

Defined in: [baseTransaction.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L31)

___

### nonce

• `Readonly` **nonce**: *BN*

Defined in: [baseTransaction.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L29)

___

### r

• `Optional` `Readonly` **r**: *BN*

Defined in: [baseTransaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L38)

___

### s

• `Optional` `Readonly` **s**: *BN*

Defined in: [baseTransaction.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L39)

___

### to

• `Optional` `Readonly` **to**: *Address*

Defined in: [baseTransaction.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L32)

___

### v

• `Optional` `Readonly` **v**: *BN*

Defined in: [baseTransaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L37)

___

### value

• `Readonly` **value**: *BN*

Defined in: [baseTransaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L33)

## Accessors

### senderR

• get **senderR**(): *undefined* \| *BN*

EIP-2930 alias for `r`

**`deprecated`** use `r` instead

**Returns:** *undefined* \| *BN*

Defined in: [baseTransaction.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L95)

___

### senderS

• get **senderS**(): *undefined* \| *BN*

EIP-2930 alias for `s`

**`deprecated`** use `s` instead

**Returns:** *undefined* \| *BN*

Defined in: [baseTransaction.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L103)

___

### transactionType

• get **transactionType**(): *number*

Returns the transaction type

**Returns:** *number*

Defined in: [baseTransaction.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L80)

___

### type

• get **type**(): *number*

Alias for `transactionType`

**Returns:** *number*

Defined in: [baseTransaction.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L87)

___

### yParity

• get **yParity**(): *undefined* \| *BN*

EIP-2930 alias for `v`

**`deprecated`** use `v` instead

**Returns:** *undefined* \| *BN*

Defined in: [baseTransaction.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L111)

## Methods

### getBaseFee

▸ **getBaseFee**(): *BN*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

Defined in: [baseTransaction.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L139)

___

### getDataFee

▸ **getDataFee**(): *BN*

The amount of gas paid for the data in this tx

**Returns:** *BN*

Defined in: [baseTransaction.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L150)

___

### getMessageToSign

▸ `Abstract`**getMessageToSign**(): *Buffer*

Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L188)

___

### getMessageToVerifySignature

▸ `Abstract`**getMessageToVerifySignature**(): *Buffer*

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L192)

___

### getSenderAddress

▸ **getSenderAddress**(): *Address*

Returns the sender's address

**Returns:** *Address*

Defined in: [baseTransaction.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L215)

___

### getSenderPublicKey

▸ `Abstract`**getSenderPublicKey**(): *Buffer*

Returns the public key of the sender

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L222)

___

### getUpfrontCost

▸ **getUpfrontCost**(): *BN*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

Defined in: [baseTransaction.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L164)

___

### hash

▸ `Abstract`**hash**(): *Buffer*

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L190)

___

### isSigned

▸ **isSigned**(): *boolean*

**Returns:** *boolean*

Defined in: [baseTransaction.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L194)

___

### raw

▸ `Abstract`**raw**(): *Buffer*[] \| [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray)

Returns a Buffer Array of the raw Buffers of this transaction, in order.

**Returns:** *Buffer*[] \| [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray)

Defined in: [baseTransaction.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L178)

___

### serialize

▸ `Abstract`**serialize**(): *Buffer*

Returns the encoding of the transaction.

**Returns:** *Buffer*

Defined in: [baseTransaction.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L183)

___

### sign

▸ **sign**(`privateKey`: *Buffer*): TransactionObject

Signs a tx and returns a new signed tx object

#### Parameters:

Name | Type |
:------ | :------ |
`privateKey` | *Buffer* |

**Returns:** TransactionObject

Defined in: [baseTransaction.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L227)

___

### toCreationAddress

▸ **toCreationAddress**(): *boolean*

If the tx's `to` is to the creation address

**Returns:** *boolean*

Defined in: [baseTransaction.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L171)

___

### toJSON

▸ `Abstract`**toJSON**(): [*JsonTx*](../interfaces/types.jsontx.md)

Returns an object with the JSON representation of the transaction

**Returns:** [*JsonTx*](../interfaces/types.jsontx.md)

Defined in: [baseTransaction.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L239)

___

### validate

▸ **validate**(): *boolean*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

Defined in: [baseTransaction.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L119)

▸ **validate**(`stringError`: *false*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`stringError` | *false* |

**Returns:** *boolean*

Defined in: [baseTransaction.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L120)

▸ **validate**(`stringError`: *true*): *string*[]

#### Parameters:

Name | Type |
:------ | :------ |
`stringError` | *true* |

**Returns:** *string*[]

Defined in: [baseTransaction.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L121)

___

### verifySignature

▸ **verifySignature**(): *boolean*

Determines if the signature is valid

**Returns:** *boolean*

Defined in: [baseTransaction.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L202)
