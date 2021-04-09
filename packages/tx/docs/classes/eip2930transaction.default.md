[@ethereumjs/tx](../README.md) / [eip2930Transaction](../modules/eip2930transaction.md) / default

# Class: default

[eip2930Transaction](../modules/eip2930transaction.md).default

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Hierarchy

* [*BaseTransaction*](basetransaction.basetransaction-1.md)<[*default*](eip2930transaction.default.md)\>

  ↳ **default**

## Table of contents

### Constructors

- [constructor](eip2930transaction.default.md#constructor)

### Properties

- [AccessListJSON](eip2930transaction.default.md#accesslistjson)
- [accessList](eip2930transaction.default.md#accesslist)
- [chainId](eip2930transaction.default.md#chainid)
- [common](eip2930transaction.default.md#common)
- [data](eip2930transaction.default.md#data)
- [gasLimit](eip2930transaction.default.md#gaslimit)
- [gasPrice](eip2930transaction.default.md#gasprice)
- [nonce](eip2930transaction.default.md#nonce)
- [r](eip2930transaction.default.md#r)
- [s](eip2930transaction.default.md#s)
- [to](eip2930transaction.default.md#to)
- [v](eip2930transaction.default.md#v)
- [value](eip2930transaction.default.md#value)

### Accessors

- [senderR](eip2930transaction.default.md#senderr)
- [senderS](eip2930transaction.default.md#senders)
- [transactionType](eip2930transaction.default.md#transactiontype)
- [type](eip2930transaction.default.md#type)
- [yParity](eip2930transaction.default.md#yparity)

### Methods

- [\_processSignature](eip2930transaction.default.md#_processsignature)
- [getBaseFee](eip2930transaction.default.md#getbasefee)
- [getDataFee](eip2930transaction.default.md#getdatafee)
- [getMessageToSign](eip2930transaction.default.md#getmessagetosign)
- [getMessageToVerifySignature](eip2930transaction.default.md#getmessagetoverifysignature)
- [getSenderAddress](eip2930transaction.default.md#getsenderaddress)
- [getSenderPublicKey](eip2930transaction.default.md#getsenderpublickey)
- [getUpfrontCost](eip2930transaction.default.md#getupfrontcost)
- [hash](eip2930transaction.default.md#hash)
- [isSigned](eip2930transaction.default.md#issigned)
- [raw](eip2930transaction.default.md#raw)
- [serialize](eip2930transaction.default.md#serialize)
- [sign](eip2930transaction.default.md#sign)
- [toCreationAddress](eip2930transaction.default.md#tocreationaddress)
- [toJSON](eip2930transaction.default.md#tojson)
- [validate](eip2930transaction.default.md#validate)
- [verifySignature](eip2930transaction.default.md#verifysignature)
- [fromRlpSerializedTx](eip2930transaction.default.md#fromrlpserializedtx)
- [fromSerializedTx](eip2930transaction.default.md#fromserializedtx)
- [fromTxData](eip2930transaction.default.md#fromtxdata)
- [fromValuesArray](eip2930transaction.default.md#fromvaluesarray)

## Constructors

### constructor

\+ **new default**(`txData`: [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters:

Name | Type |
:------ | :------ |
`txData` | [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md) |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](eip2930transaction.default.md)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L110)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [*AccessList*](../modules/types.md#accesslist)

Defined in: [eip2930Transaction.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L36)

___

### accessList

• `Readonly` **accessList**: [*AccessListBuffer*](../modules/types.md#accesslistbuffer)

Defined in: [eip2930Transaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L35)

___

### chainId

• `Readonly` **chainId**: *BN*

Defined in: [eip2930Transaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L34)

___

### common

• `Readonly` **common**: *default*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[common](basetransaction.basetransaction-1.md#common)

Defined in: [baseTransaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L35)

___

### data

• `Readonly` **data**: *Buffer*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[data](basetransaction.basetransaction-1.md#data)

Defined in: [baseTransaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L34)

___

### gasLimit

• `Readonly` **gasLimit**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[gasLimit](basetransaction.basetransaction-1.md#gaslimit)

Defined in: [baseTransaction.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L30)

___

### gasPrice

• `Readonly` **gasPrice**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[gasPrice](basetransaction.basetransaction-1.md#gasprice)

Defined in: [baseTransaction.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L31)

___

### nonce

• `Readonly` **nonce**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[nonce](basetransaction.basetransaction-1.md#nonce)

Defined in: [baseTransaction.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L29)

___

### r

• `Optional` `Readonly` **r**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[r](basetransaction.basetransaction-1.md#r)

Defined in: [baseTransaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L38)

___

### s

• `Optional` `Readonly` **s**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[s](basetransaction.basetransaction-1.md#s)

Defined in: [baseTransaction.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L39)

___

### to

• `Optional` `Readonly` **to**: *Address*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[to](basetransaction.basetransaction-1.md#to)

Defined in: [baseTransaction.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L32)

___

### v

• `Optional` `Readonly` **v**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[v](basetransaction.basetransaction-1.md#v)

Defined in: [baseTransaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L37)

___

### value

• `Readonly` **value**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[value](basetransaction.basetransaction-1.md#value)

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

### \_processSignature

▸ **_processSignature**(`v`: *number*, `r`: *Buffer*, `s`: *Buffer*): [*default*](eip2930transaction.default.md)

#### Parameters:

Name | Type |
:------ | :------ |
`v` | *number* |
`r` | *Buffer* |
`s` | *Buffer* |

**Returns:** [*default*](eip2930transaction.default.md)

Overrides: void

Defined in: [eip2930Transaction.ts:318](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L318)

___

### getBaseFee

▸ **getBaseFee**(): *BN*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L139)

___

### getDataFee

▸ **getDataFee**(): *BN*

The amount of gas paid for the data in this tx

**Returns:** *BN*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L211)

___

### getMessageToSign

▸ **getMessageToSign**(): *Buffer*

Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L260)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer*

Computes a sha3-256 hash which can be used to verify the signature

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L279)

___

### getSenderAddress

▸ **getSenderAddress**(): *Address*

Returns the sender's address

**Returns:** *Address*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L215)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

Returns the public key of the sender

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L286)

___

### getUpfrontCost

▸ **getUpfrontCost**(): *BN*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L164)

___

### hash

▸ **hash**(): *Buffer*

Computes a sha3-256 hash of the serialized tx

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L268)

___

### isSigned

▸ **isSigned**(): *boolean*

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L194)

___

### raw

▸ **raw**(): [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray)

Returns a Buffer Array of the raw Buffers of this transaction, in order.

Use `serialize()` to add to block data for `Block.fromValuesArray()`.

**Returns:** [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L233)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the serialized encoding of the transaction.

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L252)

___

### sign

▸ **sign**(`privateKey`: *Buffer*): [*default*](eip2930transaction.default.md)

Signs a tx and returns a new signed tx object

#### Parameters:

Name | Type |
:------ | :------ |
`privateKey` | *Buffer* |

**Returns:** [*default*](eip2930transaction.default.md)

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L227)

___

### toCreationAddress

▸ **toCreationAddress**(): *boolean*

If the tx's `to` is to the creation address

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L171)

___

### toJSON

▸ **toJSON**(): [*JsonTx*](../interfaces/types.jsontx.md)

Returns an object with the JSON representation of the transaction

**Returns:** [*JsonTx*](../interfaces/types.jsontx.md)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L344)

___

### validate

▸ **validate**(): *boolean*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L119)

▸ **validate**(`stringError`: *false*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`stringError` | *false* |

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L120)

▸ **validate**(`stringError`: *true*): *string*[]

#### Parameters:

Name | Type |
:------ | :------ |
`stringError` | *true* |

**Returns:** *string*[]

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L121)

___

### verifySignature

▸ **verifySignature**(): *boolean*

Determines if the signature is valid

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L202)

___

### fromRlpSerializedTx

▸ `Static`**fromRlpSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Instantiate a transaction from the serialized tx.
(alias of `fromSerializedTx()`)

Note: This means that the Buffer should start with 0x01.

**`deprecated`** this constructor alias is deprecated and will be removed
in favor of the `fromSerializedTx()` constructor

#### Parameters:

Name | Type |
:------ | :------ |
`serialized` | *Buffer* |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L75)

___

### fromSerializedTx

▸ `Static`**fromSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Instantiate a transaction from the serialized tx.

Note: this means that the Buffer should start with 0x01.

#### Parameters:

Name | Type |
:------ | :------ |
`serialized` | *Buffer* |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L50)

___

### fromTxData

▸ `Static`**fromTxData**(`txData`: [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Instantiate a transaction from a data dictionary

#### Parameters:

Name | Type |
:------ | :------ |
`txData` | [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md) |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L41)

___

### fromValuesArray

▸ `Static`**fromValuesArray**(`values`: [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Create a transaction from a values array.

The format is:
chainId, nonce, gasPrice, gasLimit, to, value, data, access_list, yParity (v), senderR (r), senderS (s)

#### Parameters:

Name | Type |
:------ | :------ |
`values` | [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray) |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L85)
