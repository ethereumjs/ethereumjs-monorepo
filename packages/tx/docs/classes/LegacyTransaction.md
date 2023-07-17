[@ethereumjs/tx](../README.md) / LegacyTransaction

# Class: LegacyTransaction

An Ethereum non-typed (legacy) transaction

## Hierarchy

- `BaseTransaction`<[`Legacy`](../enums/TransactionType.md#legacy)\>

  ↳ **`LegacyTransaction`**

## Table of contents

### Constructors

- [constructor](LegacyTransaction.md#constructor)

### Properties

- [common](LegacyTransaction.md#common)
- [data](LegacyTransaction.md#data)
- [gasLimit](LegacyTransaction.md#gaslimit)
- [gasPrice](LegacyTransaction.md#gasprice)
- [nonce](LegacyTransaction.md#nonce)
- [r](LegacyTransaction.md#r)
- [s](LegacyTransaction.md#s)
- [to](LegacyTransaction.md#to)
- [v](LegacyTransaction.md#v)
- [value](LegacyTransaction.md#value)

### Accessors

- [type](LegacyTransaction.md#type)

### Methods

- [errorStr](LegacyTransaction.md#errorstr)
- [getBaseFee](LegacyTransaction.md#getbasefee)
- [getDataFee](LegacyTransaction.md#getdatafee)
- [getHashedMessageToSign](LegacyTransaction.md#gethashedmessagetosign)
- [getMessageToSign](LegacyTransaction.md#getmessagetosign)
- [getMessageToVerifySignature](LegacyTransaction.md#getmessagetoverifysignature)
- [getSenderAddress](LegacyTransaction.md#getsenderaddress)
- [getSenderPublicKey](LegacyTransaction.md#getsenderpublickey)
- [getUpfrontCost](LegacyTransaction.md#getupfrontcost)
- [getValidationErrors](LegacyTransaction.md#getvalidationerrors)
- [hash](LegacyTransaction.md#hash)
- [isSigned](LegacyTransaction.md#issigned)
- [isValid](LegacyTransaction.md#isvalid)
- [raw](LegacyTransaction.md#raw)
- [serialize](LegacyTransaction.md#serialize)
- [sign](LegacyTransaction.md#sign)
- [supports](LegacyTransaction.md#supports)
- [toCreationAddress](LegacyTransaction.md#tocreationaddress)
- [toJSON](LegacyTransaction.md#tojson)
- [verifySignature](LegacyTransaction.md#verifysignature)
- [fromSerializedTx](LegacyTransaction.md#fromserializedtx)
- [fromTxData](LegacyTransaction.md#fromtxdata)
- [fromValuesArray](LegacyTransaction.md#fromvaluesarray)

## Constructors

### constructor

• **new LegacyTransaction**(`txData`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`LegacyTxData`](../README.md#legacytxdata) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Overrides

BaseTransaction&lt;TransactionType.Legacy\&gt;.constructor

#### Defined in

[tx/src/legacyTransaction.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L110)

## Properties

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

[tx/src/legacyTransaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L40)

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

BaseTransaction.data

#### Defined in

[tx/src/baseTransaction.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L54)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

BaseTransaction.gasLimit

#### Defined in

[tx/src/baseTransaction.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L51)

___

### gasPrice

• `Readonly` **gasPrice**: `bigint`

#### Defined in

[tx/src/legacyTransaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L38)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

BaseTransaction.nonce

#### Defined in

[tx/src/baseTransaction.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L50)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

BaseTransaction.r

#### Defined in

[tx/src/baseTransaction.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L57)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

BaseTransaction.s

#### Defined in

[tx/src/baseTransaction.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L58)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

BaseTransaction.to

#### Defined in

[tx/src/baseTransaction.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L52)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

BaseTransaction.v

#### Defined in

[tx/src/baseTransaction.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L56)

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

BaseTransaction.value

#### Defined in

[tx/src/baseTransaction.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L53)

## Accessors

### type

• `get` **type**(): [`TransactionType`](../enums/TransactionType.md)

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

[`TransactionType`](../enums/TransactionType.md)

#### Inherited from

BaseTransaction.type

#### Defined in

[tx/src/baseTransaction.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L128)

## Methods

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

BaseTransaction.errorStr

#### Defined in

[tx/src/legacyTransaction.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L395)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

BaseTransaction.getBaseFee

#### Defined in

[tx/src/baseTransaction.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L205)

___

### getDataFee

▸ **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

BaseTransaction.getDataFee

#### Defined in

[tx/src/legacyTransaction.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L230)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getHashedMessageToSign

#### Defined in

[tx/src/legacyTransaction.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L222)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`[]

Returns the raw unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: the raw message message format for the legacy tx is not RLP encoded
and you might need to do yourself with:

```javascript
import { RLP } from '@ethereumjs/rlp'
const message = tx.getMessageToSign()
const serializedMessage = RLP.encode(message)) // use this for the HW wallet input
```

#### Returns

`Uint8Array`[]

#### Overrides

BaseTransaction.getMessageToSign

#### Defined in

[tx/src/legacyTransaction.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L199)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

[tx/src/legacyTransaction.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L277)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

BaseTransaction.getSenderAddress

#### Defined in

[tx/src/baseTransaction.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L301)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getSenderPublicKey

#### Defined in

[tx/src/legacyTransaction.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L288)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Overrides

BaseTransaction.getUpfrontCost

#### Defined in

[tx/src/legacyTransaction.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L248)

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

BaseTransaction.getValidationErrors

#### Defined in

[tx/src/baseTransaction.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L156)

___

### hash

▸ **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.hash

#### Defined in

[tx/src/legacyTransaction.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L258)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

BaseTransaction.isSigned

#### Defined in

[tx/src/baseTransaction.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L276)

___

### isValid

▸ **isValid**(): `boolean`

Validates the transaction signature and minimum gas requirements.

#### Returns

`boolean`

true if the transaction is valid, false otherwise

#### Inherited from

BaseTransaction.isValid

#### Defined in

[tx/src/baseTransaction.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L174)

___

### raw

▸ **raw**(): `LegacyTxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the legacy transaction, in order.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

For legacy txs this is also the correct format to add transactions
to a block with Block.fromValuesArray (use the `serialize()` method
for typed txs).

For an unsigned tx this method returns the empty Bytes values
for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
representation have a look at Transaction.getMessageToSign.

#### Returns

`LegacyTxValuesArray`

#### Overrides

BaseTransaction.raw

#### Defined in

[tx/src/legacyTransaction.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L159)

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the serialized encoding of the legacy transaction.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

For an unsigned tx this method uses the empty Uint8Array values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use Transaction.getMessageToSign.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.serialize

#### Defined in

[tx/src/legacyTransaction.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L182)

___

### sign

▸ **sign**(`privateKey`): [`LegacyTransaction`](LegacyTransaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Inherited from

BaseTransaction.sign

#### Defined in

[tx/src/baseTransaction.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L319)

___

### supports

▸ **supports**(`capability`): `boolean`

Checks if a tx type defining capability is active
on a tx, for example the EIP-1559 fee market mechanism
or the EIP-2930 access list feature.

Note that this is different from the tx type itself,
so EIP-2930 access lists can very well be active
on an EIP-1559 tx for example.

This method can be useful for feature checks if the
tx type is unknown (e.g. when instantiated with
the tx factory).

See `Capabilities` in the `types` module for a reference
on all supported capabilities.

#### Parameters

| Name | Type |
| :------ | :------ |
| `capability` | [`Capability`](../enums/Capability.md) |

#### Returns

`boolean`

#### Inherited from

BaseTransaction.supports

#### Defined in

[tx/src/baseTransaction.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L148)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

BaseTransaction.toCreationAddress

#### Defined in

[tx/src/baseTransaction.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L245)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Returns an object with the JSON representation of the transaction.

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

BaseTransaction.toJSON

#### Defined in

[tx/src/legacyTransaction.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L338)

___

### verifySignature

▸ **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

BaseTransaction.verifySignature

#### Defined in

[tx/src/baseTransaction.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L288)

___

### fromSerializedTx

▸ `Static` **fromSerializedTx**(`serialized`, `opts?`): [`LegacyTransaction`](LegacyTransaction.md)

Instantiate a transaction from the serialized tx.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Defined in

[tx/src/legacyTransaction.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L59)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`, `opts?`): [`LegacyTransaction`](LegacyTransaction.md)

Instantiate a transaction from a data dictionary.

Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }

Notes:
- All parameters are optional and have some basic default values

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`LegacyTxData`](../README.md#legacytxdata) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Defined in

[tx/src/legacyTransaction.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L50)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`LegacyTransaction`](LegacyTransaction.md)

Create a transaction from a values array.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `LegacyTxValuesArray` |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Defined in

[tx/src/legacyTransaction.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L74)
