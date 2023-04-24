[@ethereumjs/tx](../README.md) / AccessListEIP2930Transaction

# Class: AccessListEIP2930Transaction

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Hierarchy

- `BaseTransaction`<[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)\>

  ↳ **`AccessListEIP2930Transaction`**

## Table of contents

### Constructors

- [constructor](AccessListEIP2930Transaction.md#constructor)

### Properties

- [AccessListJSON](AccessListEIP2930Transaction.md#accesslistjson)
- [accessList](AccessListEIP2930Transaction.md#accesslist)
- [chainId](AccessListEIP2930Transaction.md#chainid)
- [common](AccessListEIP2930Transaction.md#common)
- [data](AccessListEIP2930Transaction.md#data)
- [gasLimit](AccessListEIP2930Transaction.md#gaslimit)
- [gasPrice](AccessListEIP2930Transaction.md#gasprice)
- [nonce](AccessListEIP2930Transaction.md#nonce)
- [r](AccessListEIP2930Transaction.md#r)
- [s](AccessListEIP2930Transaction.md#s)
- [to](AccessListEIP2930Transaction.md#to)
- [v](AccessListEIP2930Transaction.md#v)
- [value](AccessListEIP2930Transaction.md#value)

### Accessors

- [type](AccessListEIP2930Transaction.md#type)

### Methods

- [\_processSignature](AccessListEIP2930Transaction.md#_processsignature)
- [errorStr](AccessListEIP2930Transaction.md#errorstr)
- [getBaseFee](AccessListEIP2930Transaction.md#getbasefee)
- [getDataFee](AccessListEIP2930Transaction.md#getdatafee)
- [getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign)
- [getMessageToVerifySignature](AccessListEIP2930Transaction.md#getmessagetoverifysignature)
- [getSenderAddress](AccessListEIP2930Transaction.md#getsenderaddress)
- [getSenderPublicKey](AccessListEIP2930Transaction.md#getsenderpublickey)
- [getUpfrontCost](AccessListEIP2930Transaction.md#getupfrontcost)
- [hash](AccessListEIP2930Transaction.md#hash)
- [isSigned](AccessListEIP2930Transaction.md#issigned)
- [raw](AccessListEIP2930Transaction.md#raw)
- [serialize](AccessListEIP2930Transaction.md#serialize)
- [sign](AccessListEIP2930Transaction.md#sign)
- [supports](AccessListEIP2930Transaction.md#supports)
- [toCreationAddress](AccessListEIP2930Transaction.md#tocreationaddress)
- [toJSON](AccessListEIP2930Transaction.md#tojson)
- [validate](AccessListEIP2930Transaction.md#validate)
- [verifySignature](AccessListEIP2930Transaction.md#verifysignature)
- [fromSerializedTx](AccessListEIP2930Transaction.md#fromserializedtx)
- [fromTxData](AccessListEIP2930Transaction.md#fromtxdata)
- [fromValuesArray](AccessListEIP2930Transaction.md#fromvaluesarray)

## Constructors

### constructor

• **new AccessListEIP2930Transaction**(`txData`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`AccessListEIP2930TxData`](../interfaces/AccessListEIP2930TxData.md) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Overrides

BaseTransaction&lt;AccessListEIP2930Transaction\&gt;.constructor

#### Defined in

[eip2930Transaction.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L136)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [`AccessList`](../README.md#accesslist)

#### Defined in

[eip2930Transaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L40)

___

### accessList

• `Readonly` **accessList**: [`AccessListBuffer`](../README.md#accesslistbuffer)

#### Defined in

[eip2930Transaction.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L39)

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Defined in

[eip2930Transaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L38)

___

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

[eip2930Transaction.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L43)

___

### data

• `Readonly` **data**: `Buffer`

#### Inherited from

BaseTransaction.data

#### Defined in

[baseTransaction.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L52)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

BaseTransaction.gasLimit

#### Defined in

[baseTransaction.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L49)

___

### gasPrice

• `Readonly` **gasPrice**: `bigint`

#### Defined in

[eip2930Transaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L41)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

BaseTransaction.nonce

#### Defined in

[baseTransaction.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L48)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

BaseTransaction.r

#### Defined in

[baseTransaction.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L55)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

BaseTransaction.s

#### Defined in

[baseTransaction.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L56)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

BaseTransaction.to

#### Defined in

[baseTransaction.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L50)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

BaseTransaction.v

#### Defined in

[baseTransaction.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L54)

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

BaseTransaction.value

#### Defined in

[baseTransaction.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L51)

## Accessors

### type

• `get` **type**(): `number`

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

`number`

#### Inherited from

BaseTransaction.type

#### Defined in

[baseTransaction.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L134)

## Methods

### \_processSignature

▸ **_processSignature**(`v`, `r`, `s`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `Buffer` |
| `s` | `Buffer` |

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Overrides

BaseTransaction.\_processSignature

#### Defined in

[eip2930Transaction.ts:335](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L335)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

BaseTransaction.errorStr

#### Defined in

[eip2930Transaction.ts:380](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L380)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

BaseTransaction.getBaseFee

#### Defined in

[baseTransaction.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L204)

___

### getDataFee

▸ **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

BaseTransaction.getDataFee

#### Defined in

[eip2930Transaction.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L181)

___

### getMessageToSign

▸ **getMessageToSign**(`hashMessage?`): `Buffer`

Returns the serialized unsigned tx (hashed or raw), which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign(false) // use this for the HW wallet input
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hashMessage` | `boolean` | `true` | Return hashed message if set to true (default: true) |

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getMessageToSign

#### Defined in

[eip2930Transaction.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L266)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Buffer`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

[eip2930Transaction.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L304)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

BaseTransaction.getSenderAddress

#### Defined in

[baseTransaction.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L301)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

Returns the public key of the sender

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getSenderPublicKey

#### Defined in

[eip2930Transaction.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L311)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Overrides

BaseTransaction.getUpfrontCost

#### Defined in

[eip2930Transaction.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L202)

___

### hash

▸ **hash**(): `Buffer`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Buffer`

#### Overrides

BaseTransaction.hash

#### Defined in

[eip2930Transaction.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L285)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

BaseTransaction.isSigned

#### Defined in

[baseTransaction.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L276)

___

### raw

▸ **raw**(): [`AccessListEIP2930ValuesArray`](../README.md#accesslisteip2930valuesarray)

Returns a Buffer Array of the raw Buffers of the EIP-2930 transaction, in order.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

Use [serialize](AccessListEIP2930Transaction.md#serialize) to add a transaction to a block
with Block.fromValuesArray.

For an unsigned tx this method uses the empty Buffer values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign).

#### Returns

[`AccessListEIP2930ValuesArray`](../README.md#accesslisteip2930valuesarray)

#### Overrides

BaseTransaction.raw

#### Defined in

[eip2930Transaction.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L219)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the serialized encoding of the EIP-2930 transaction.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Buffer`

#### Overrides

BaseTransaction.serialize

#### Defined in

[eip2930Transaction.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L245)

___

### sign

▸ **sign**(`privateKey`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

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

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Inherited from

BaseTransaction.sign

#### Defined in

[baseTransaction.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L319)

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
| `capability` | [`Capability`](../enums/Capability.md) |

#### Returns

`boolean`

#### Inherited from

BaseTransaction.supports

#### Defined in

[baseTransaction.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L154)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

BaseTransaction.toCreationAddress

#### Defined in

[baseTransaction.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L244)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

BaseTransaction.toJSON

#### Defined in

[eip2930Transaction.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L359)

___

### validate

▸ **validate**(): `boolean`

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

#### Returns

`boolean`

#### Inherited from

BaseTransaction.validate

#### Defined in

[baseTransaction.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L162)

▸ **validate**(`stringError`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

#### Returns

`boolean`

#### Inherited from

BaseTransaction.validate

#### Defined in

[baseTransaction.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L163)

▸ **validate**(`stringError`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

#### Returns

`string`[]

#### Inherited from

BaseTransaction.validate

#### Defined in

[baseTransaction.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L164)

___

### verifySignature

▸ **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

BaseTransaction.verifySignature

#### Defined in

[baseTransaction.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L288)

___

### fromSerializedTx

▸ `Static` **fromSerializedTx**(`serialized`, `opts?`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Buffer` |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

[eip2930Transaction.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L73)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`, `opts?`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`AccessListEIP2930TxData`](../interfaces/AccessListEIP2930TxData.md) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

[eip2930Transaction.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L63)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`AccessListEIP2930ValuesArray`](../README.md#accesslisteip2930valuesarray) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

[eip2930Transaction.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L97)
