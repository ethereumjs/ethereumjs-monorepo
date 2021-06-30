[@ethereumjs/tx](../README.md) / [legacyTransaction](../modules/legacytransaction.md) / default

# Class: default

[legacyTransaction](../modules/legacytransaction.md).default

An Ethereum non-typed (legacy) transaction

## Hierarchy

- [BaseTransaction](basetransaction.basetransaction-1.md)<[default](legacytransaction.default.md)\>

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
- [supports](legacytransaction.default.md#supports)
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

• **new default**(`txData`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [TxData](../modules/types.md#txdata) |
| `opts` | [TxOptions](../interfaces/types.txoptions.md) |

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[constructor](basetransaction.basetransaction-1.md#constructor)

#### Defined in

[legacyTransaction.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L93)

## Properties

### common

• `Readonly` **common**: `default`

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[common](basetransaction.basetransaction-1.md#common)

#### Defined in

[legacyTransaction.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L23)

___

### data

• `Readonly` **data**: `Buffer`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[data](basetransaction.basetransaction-1.md#data)

#### Defined in

[baseTransaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L38)

___

### gasLimit

• `Readonly` **gasLimit**: `BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[gasLimit](basetransaction.basetransaction-1.md#gaslimit)

#### Defined in

[baseTransaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L35)

___

### gasPrice

• `Readonly` **gasPrice**: `BN`

#### Defined in

[legacyTransaction.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L21)

___

### nonce

• `Readonly` **nonce**: `BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[nonce](basetransaction.basetransaction-1.md#nonce)

#### Defined in

[baseTransaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L34)

___

### r

• `Optional` `Readonly` **r**: `BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[r](basetransaction.basetransaction-1.md#r)

#### Defined in

[baseTransaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L41)

___

### s

• `Optional` `Readonly` **s**: `BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[s](basetransaction.basetransaction-1.md#s)

#### Defined in

[baseTransaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L42)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[to](basetransaction.basetransaction-1.md#to)

#### Defined in

[baseTransaction.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L36)

___

### v

• `Optional` `Readonly` **v**: `BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[v](basetransaction.basetransaction-1.md#v)

#### Defined in

[baseTransaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L40)

___

### value

• `Readonly` **value**: `BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[value](basetransaction.basetransaction-1.md#value)

#### Defined in

[baseTransaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L37)

## Accessors

### transactionType

• `get` **transactionType**(): `number`

Alias for [BaseTransaction.type](basetransaction.basetransaction-1.md#type)

**`deprecated`** Use `type` instead

#### Returns

`number`

#### Defined in

[baseTransaction.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L104)

___

### type

• `get` **type**(): `number`

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

`number`

#### Defined in

[baseTransaction.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L113)

## Methods

### getBaseFee

▸ **getBaseFee**(): `BN`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[getBaseFee](basetransaction.basetransaction-1.md#getbasefee)

#### Defined in

[baseTransaction.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L161)

___

### getDataFee

▸ **getDataFee**(): `BN`

The amount of gas paid for the data in this tx

#### Returns

`BN`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[getDataFee](basetransaction.basetransaction-1.md#getdatafee)

#### Defined in

[baseTransaction.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L172)

___

### getMessageToSign

▸ **getMessageToSign**(`hashMessage`): `Buffer`[]

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

#### Returns

`Buffer`[]

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[getMessageToSign](basetransaction.basetransaction-1.md#getmessagetosign)

#### Defined in

[legacyTransaction.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L206)

▸ **getMessageToSign**(`hashMessage?`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage?` | ``true`` |

#### Returns

`Buffer`

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[getMessageToSign](basetransaction.basetransaction-1.md#getmessagetosign)

#### Defined in

[legacyTransaction.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L207)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Buffer`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Buffer`

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[getMessageToVerifySignature](basetransaction.basetransaction-1.md#getmessagetoverifysignature)

#### Defined in

[legacyTransaction.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L237)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[getSenderAddress](basetransaction.basetransaction-1.md#getsenderaddress)

#### Defined in

[baseTransaction.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L249)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

Returns the public key of the sender

#### Returns

`Buffer`

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[getSenderPublicKey](basetransaction.basetransaction-1.md#getsenderpublickey)

#### Defined in

[legacyTransaction.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L248)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `BN`

The up front amount that an account must have for this transaction to be valid

#### Returns

`BN`

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[getUpfrontCost](basetransaction.basetransaction-1.md#getupfrontcost)

#### Defined in

[legacyTransaction.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L220)

___

### hash

▸ **hash**(): `Buffer`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use {@link Transaction.getMessageToSign} to get a tx hash for the purpose of signing.

#### Returns

`Buffer`

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[hash](basetransaction.basetransaction-1.md#hash)

#### Defined in

[legacyTransaction.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L230)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[isSigned](basetransaction.basetransaction-1.md#issigned)

#### Defined in

[baseTransaction.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L216)

___

### raw

▸ **raw**(): [TxValuesArray](../modules/types.md#txvaluesarray)

Returns a Buffer Array of the raw Buffers of the legacy transaction, in order.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

For an unsigned legacy tx this method returns the the empty Buffer values
for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
representation have a look at {@link Transaction.getMessageToSign}.

#### Returns

[TxValuesArray](../modules/types.md#txvaluesarray)

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[raw](basetransaction.basetransaction-1.md#raw)

#### Defined in

[legacyTransaction.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L145)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the serialized encoding of the legacy transaction.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

For an unsigned legacy tx this method uses the empty Buffer values
for the signature parameters `v`, `r` and `s` for encoding. For an
EIP-155 compliant representation use {@link Transaction.getMessageToSign}.

#### Returns

`Buffer`

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[serialize](basetransaction.basetransaction-1.md#serialize)

#### Defined in

[legacyTransaction.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L168)

___

### sign

▸ **sign**(`privateKey`): [default](legacytransaction.default.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |

#### Returns

[default](legacytransaction.default.md)

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[sign](basetransaction.basetransaction-1.md#sign)

#### Defined in

[baseTransaction.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L267)

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

See `Capabilites` in the `types` module for a reference
on all supported capabilities.

#### Parameters

| Name | Type |
| :------ | :------ |
| `capability` | [Capabilities](../enums/types.capabilities.md) |

#### Returns

`boolean`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[supports](basetransaction.basetransaction-1.md#supports)

#### Defined in

[baseTransaction.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L133)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[toCreationAddress](basetransaction.basetransaction-1.md#tocreationaddress)

#### Defined in

[baseTransaction.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L191)

___

### toJSON

▸ **toJSON**(): [JsonTx](../interfaces/types.jsontx.md)

Returns an object with the JSON representation of the transaction.

#### Returns

[JsonTx](../interfaces/types.jsontx.md)

#### Overrides

[BaseTransaction](basetransaction.basetransaction-1.md).[toJSON](basetransaction.basetransaction-1.md#tojson)

#### Defined in

[legacyTransaction.ts:305](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L305)

___

### validate

▸ **validate**(): `boolean`

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

#### Returns

`boolean`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[validate](basetransaction.basetransaction-1.md#validate)

#### Defined in

[baseTransaction.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L141)

▸ **validate**(`stringError`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

#### Returns

`boolean`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[validate](basetransaction.basetransaction-1.md#validate)

#### Defined in

[baseTransaction.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L142)

▸ **validate**(`stringError`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

#### Returns

`string`[]

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[validate](basetransaction.basetransaction-1.md#validate)

#### Defined in

[baseTransaction.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L143)

___

### verifySignature

▸ **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

[BaseTransaction](basetransaction.basetransaction-1.md).[verifySignature](basetransaction.basetransaction-1.md#verifysignature)

#### Defined in

[baseTransaction.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L236)

___

### fromRlpSerializedTx

▸ `Static` **fromRlpSerializedTx**(`serialized`, `opts?`): [default](legacytransaction.default.md)

Instantiate a transaction from the serialized tx.
(alias of {@link Transaction.fromSerializedTx})

**`deprecated`** this constructor alias is deprecated and will be removed
in favor of the {@link Transaction.fromSerializedTx} constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Buffer` |
| `opts` | [TxOptions](../interfaces/types.txoptions.md) |

#### Returns

[default](legacytransaction.default.md)

#### Defined in

[legacyTransaction.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L59)

___

### fromSerializedTx

▸ `Static` **fromSerializedTx**(`serialized`, `opts?`): [default](legacytransaction.default.md)

Instantiate a transaction from the serialized tx.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Buffer` |
| `opts` | [TxOptions](../interfaces/types.txoptions.md) |

#### Returns

[default](legacytransaction.default.md)

#### Defined in

[legacyTransaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L42)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`, `opts?`): [default](legacytransaction.default.md)

Instantiate a transaction from a data dictionary.

Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }

Notes:
- All parameters are optional and have some basic default values

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [TxData](../modules/types.md#txdata) |
| `opts` | [TxOptions](../interfaces/types.txoptions.md) |

#### Returns

[default](legacytransaction.default.md)

#### Defined in

[legacyTransaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L33)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [default](legacytransaction.default.md)

Create a transaction from a values array.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [TxValuesArray](../modules/types.md#txvaluesarray) |
| `opts` | [TxOptions](../interfaces/types.txoptions.md) |

#### Returns

[default](legacytransaction.default.md)

#### Defined in

[legacyTransaction.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L68)
