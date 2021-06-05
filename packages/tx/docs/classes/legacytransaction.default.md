[@ethereumjs/tx](../README.md) / [legacyTransaction](../modules/legacytransaction.md) / default

# Class: default

[legacyTransaction](../modules/legacytransaction.md).default

An Ethereum non-typed (legacy) transaction

## Hierarchy

- [*BaseTransaction*](basetransaction.basetransaction-1.md)<[*default*](legacytransaction.default.md)\>

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

- [transactionType](legacytransaction.default.md#transactiontype)
- [type](legacytransaction.default.md#type)

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

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `txData` | [*TxData*](../modules/types.md#txdata) | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](legacytransaction.default.md)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L90)

## Properties

### common

• `Readonly` **common**: *default*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[common](basetransaction.basetransaction-1.md#common)

Defined in: [baseTransaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L38)

___

### data

• `Readonly` **data**: *Buffer*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[data](basetransaction.basetransaction-1.md#data)

Defined in: [baseTransaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L37)

___

### gasLimit

• `Readonly` **gasLimit**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[gasLimit](basetransaction.basetransaction-1.md#gaslimit)

Defined in: [baseTransaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L34)

___

### gasPrice

• `Readonly` **gasPrice**: *BN*

Defined in: [legacyTransaction.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L20)

___

### nonce

• `Readonly` **nonce**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[nonce](basetransaction.basetransaction-1.md#nonce)

Defined in: [baseTransaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L33)

___

### r

• `Optional` `Readonly` **r**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[r](basetransaction.basetransaction-1.md#r)

Defined in: [baseTransaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L41)

___

### s

• `Optional` `Readonly` **s**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[s](basetransaction.basetransaction-1.md#s)

Defined in: [baseTransaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L42)

___

### to

• `Optional` `Readonly` **to**: *Address*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[to](basetransaction.basetransaction-1.md#to)

Defined in: [baseTransaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L35)

___

### v

• `Optional` `Readonly` **v**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[v](basetransaction.basetransaction-1.md#v)

Defined in: [baseTransaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L40)

___

### value

• `Readonly` **value**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[value](basetransaction.basetransaction-1.md#value)

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

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L119)

___

### getDataFee

▸ **getDataFee**(): *BN*

The amount of gas paid for the data in this tx

**Returns:** *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L130)

___

### getMessageToSign

▸ **getMessageToSign**(`hashMessage`: ``false``): *Buffer*[]

Returns the serialized unsigned tx (hashed or raw), which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: the raw message message format for the legacy tx is not RLP encoded
and you might need to do yourself with:

```javascript
import { rlp } from 'ethereumjs-util'
const message = tx.getMessageToSign(false)
const serializedMessage = rlp.encode(message) // use this for the HW wallet input
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hashMessage` | ``false`` | Return hashed message if set to true (default: true) |

**Returns:** *Buffer*[]

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L188)

▸ **getMessageToSign**(`hashMessage?`: ``true``): *Buffer*

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage?` | ``true`` |

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L189)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer*

Computes a sha3-256 hash which can be used to verify the signature

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L219)

___

### getSenderAddress

▸ **getSenderAddress**(): *Address*

Returns the sender's address

**Returns:** *Address*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L207)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

Returns the public key of the sender

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L228)

___

### getUpfrontCost

▸ **getUpfrontCost**(): *BN*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L202)

___

### hash

▸ **hash**(): *Buffer*

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use `getMessageToSign()` to get a tx hash for the purpose of signing.

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L212)

___

### isSigned

▸ **isSigned**(): *boolean*

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L174)

___

### raw

▸ **raw**(): [*TxValuesArray*](../modules/types.md#txvaluesarray)

Returns a Buffer Array of the raw Buffers of the legacy transaction, in order.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

For an unsigned legacy tx this method returns the the empty Buffer values
for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
representation have a look at the `getMessageToSign()` method.

**Returns:** [*TxValuesArray*](../modules/types.md#txvaluesarray)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L123)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the serialized encoding of the legacy transaction.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

For an unsigned legacy tx this method uses the empty Buffer values
for the signature parameters `v`, `r` and `s` for encoding. For an
EIP-155 compliant representation use the `getMessageToSign()` method.

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L146)

___

### sign

▸ **sign**(`privateKey`: *Buffer*): [*default*](legacytransaction.default.md)

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

**Returns:** [*default*](legacytransaction.default.md)

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L225)

___

### toCreationAddress

▸ **toCreationAddress**(): *boolean*

If the tx's `to` is to the creation address

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L149)

___

### toJSON

▸ **toJSON**(): [*JsonTx*](../interfaces/types.jsontx.md)

Returns an object with the JSON representation of the transaction.

**Returns:** [*JsonTx*](../interfaces/types.jsontx.md)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [legacyTransaction.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L285)

___

### validate

▸ **validate**(): *boolean*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L99)

▸ **validate**(`stringError`: ``false``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L100)

▸ **validate**(`stringError`: ``true``): *string*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

**Returns:** *string*[]

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L101)

___

### verifySignature

▸ **verifySignature**(): *boolean*

Determines if the signature is valid

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L194)

___

### fromRlpSerializedTx

▸ `Static` **fromRlpSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Instantiate a transaction from the serialized tx.
(alias of `fromSerializedTx()`)

**`deprecated`** this constructor alias is deprecated and will be removed
in favor of the `fromSerializedTx()` constructor

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `serialized` | *Buffer* | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L56)

___

### fromSerializedTx

▸ `Static` **fromSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Instantiate a transaction from the serialized tx.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `serialized` | *Buffer* | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L39)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`: [*TxData*](../modules/types.md#txdata), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Instantiate a transaction from a data dictionary.

Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }

Notes:
- All parameters are optional and have some basic default values

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `txData` | [*TxData*](../modules/types.md#txdata) | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L30)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`: [*TxValuesArray*](../modules/types.md#txvaluesarray), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](legacytransaction.default.md)

Create a transaction from a values array.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `values` | [*TxValuesArray*](../modules/types.md#txvaluesarray) | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](legacytransaction.default.md)

Defined in: [legacyTransaction.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L65)
