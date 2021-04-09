[@ethereumjs/tx](../README.md) / [legacyTransaction](../modules/legacytransaction.md) / default

# Class: default

[legacyTransaction](../modules/legacytransaction.md).default

An Ethereum non-typed (legacy) transaction

## Hierarchy

* [*BaseTransaction*](basetransaction.basetransaction-1.md)<[*default*](legacytransaction.default.md)\>

  ↳ **default**

## Table of contents

### Constructors

- [constructor](legacytransaction.default.md#constructor)

### Properties

- [common](legacytransaction.default.md#common)
- [data](legacytransaction.default.md#data)
- [gasLimit](legacytransaction.default.md#gaslimit)
- [gasPrice](legacytransaction.default.md#gasprice)
- [nonce](legacytransaction.default.md#nonce)
- [r](legacytransaction.default.md#r)
- [s](legacytransaction.default.md#s)
- [to](legacytransaction.default.md#to)
- [v](legacytransaction.default.md#v)
- [value](legacytransaction.default.md#value)

### Accessors

- [senderR](legacytransaction.default.md#senderr)
- [senderS](legacytransaction.default.md#senders)
- [transactionType](legacytransaction.default.md#transactiontype)
- [type](legacytransaction.default.md#type)
- [yParity](legacytransaction.default.md#yparity)

### Methods

- [getBaseFee](legacytransaction.default.md#getbasefee)
- [getDataFee](legacytransaction.default.md#getdatafee)
- [getMessageToSign](legacytransaction.default.md#getmessagetosign)
- [getMessageToVerifySignature](legacytransaction.default.md#getmessagetoverifysignature)
- [getSenderAddress](legacytransaction.default.md#getsenderaddress)
- [getSenderPublicKey](legacytransaction.default.md#getsenderpublickey)
- [getUpfrontCost](legacytransaction.default.md#getupfrontcost)
- [hash](legacytransaction.default.md#hash)
- [isSigned](legacytransaction.default.md#issigned)
- [raw](legacytransaction.default.md#raw)
- [serialize](legacytransaction.default.md#serialize)
- [sign](legacytransaction.default.md#sign)
- [toCreationAddress](legacytransaction.default.md#tocreationaddress)
- [toJSON](legacytransaction.default.md#tojson)
- [validate](legacytransaction.default.md#validate)
- [verifySignature](legacytransaction.default.md#verifysignature)
- [fromRlpSerializedTx](legacytransaction.default.md#fromrlpserializedtx)
- [fromSerializedTx](legacytransaction.default.md#fromserializedtx)
- [fromTxData](legacytransaction.default.md#fromtxdata)
- [fromValuesArray](legacytransaction.default.md#fromvaluesarray)

## Constructors

### constructor

\+ **new default**(`txData`: [*TxData*](../modules/types.md#txdata), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters:

Name | Type |
:------ | :------ |
`txData` | [*TxData*](../modules/types.md#txdata) |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](legacytransaction.default.md)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L80)

## Properties

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

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L150)

___

### getMessageToSign

▸ **getMessageToSign**(): *Buffer*

Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L152)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer*

Computes a sha3-256 hash which can be used to verify the signature

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L166)

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

Defined in: [legacyTransaction.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L174)

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

Defined in: [legacyTransaction.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L159)

___

### isSigned

▸ **isSigned**(): *boolean*

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L194)

___

### raw

▸ **raw**(): *Buffer*[]

Returns a Buffer Array of the raw Buffers of this transaction, in order.

**Returns:** *Buffer*[]

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L105)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the rlp encoding of the transaction.

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L122)

___

### sign

▸ **sign**(`privateKey`: *Buffer*): [*default*](legacytransaction.default.md)

Signs a tx and returns a new signed tx object

#### Parameters:

Name | Type |
:------ | :------ |
`privateKey` | *Buffer* |

**Returns:** [*default*](legacytransaction.default.md)

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

Defined in: [legacyTransaction.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L234)

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

▸ `Static`**fromRlpSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Instantiate a transaction from the serialized tx.
(alias of `fromSerializedTx()`)

**`deprecated`** this constructor alias is deprecated and will be removed
in favor of the `fromSerializedTx()` constructor

#### Parameters:

Name | Type |
:------ | :------ |
`serialized` | *Buffer* |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L45)

___

### fromSerializedTx

▸ `Static`**fromSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Instantiate a transaction from the serialized tx.

#### Parameters:

Name | Type |
:------ | :------ |
`serialized` | *Buffer* |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L28)

___

### fromTxData

▸ `Static`**fromTxData**(`txData`: [*TxData*](../modules/types.md#txdata), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Instantiate a transaction from a data dictionary

#### Parameters:

Name | Type |
:------ | :------ |
`txData` | [*TxData*](../modules/types.md#txdata) |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L21)

___

### fromValuesArray

▸ `Static`**fromValuesArray**(`values`: *Buffer*[], `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Create a transaction from a values array.

The format is:
nonce, gasPrice, gasLimit, to, value, data, v, r, s

#### Parameters:

Name | Type |
:------ | :------ |
`values` | *Buffer*[] |
`opts` | [*TxOptions*](../interfaces/types.txoptions.md) |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L55)
