[@ethereumjs/tx](../README.md) / AccessListEIP2930Transaction

# Class: AccessListEIP2930Transaction

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Hierarchy

- `BaseTransaction`<[`AccessListEIP2930`](../enums/TransactionType.md#accesslisteip2930)\>

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

- [errorStr](AccessListEIP2930Transaction.md#errorstr)
- [getBaseFee](AccessListEIP2930Transaction.md#getbasefee)
- [getDataFee](AccessListEIP2930Transaction.md#getdatafee)
- [getHashedMessageToSign](AccessListEIP2930Transaction.md#gethashedmessagetosign)
- [getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign)
- [getMessageToVerifySignature](AccessListEIP2930Transaction.md#getmessagetoverifysignature)
- [getSenderAddress](AccessListEIP2930Transaction.md#getsenderaddress)
- [getSenderPublicKey](AccessListEIP2930Transaction.md#getsenderpublickey)
- [getUpfrontCost](AccessListEIP2930Transaction.md#getupfrontcost)
- [getValidationErrors](AccessListEIP2930Transaction.md#getvalidationerrors)
- [hash](AccessListEIP2930Transaction.md#hash)
- [isSigned](AccessListEIP2930Transaction.md#issigned)
- [isValid](AccessListEIP2930Transaction.md#isvalid)
- [raw](AccessListEIP2930Transaction.md#raw)
- [serialize](AccessListEIP2930Transaction.md#serialize)
- [sign](AccessListEIP2930Transaction.md#sign)
- [supports](AccessListEIP2930Transaction.md#supports)
- [toCreationAddress](AccessListEIP2930Transaction.md#tocreationaddress)
- [toJSON](AccessListEIP2930Transaction.md#tojson)
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

BaseTransaction&lt;TransactionType.AccessListEIP2930\&gt;.constructor

#### Defined in

[tx/src/eip2930Transaction.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L135)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [`AccessList`](../README.md#accesslist)

#### Defined in

[tx/src/eip2930Transaction.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L47)

___

### accessList

• `Readonly` **accessList**: [`AccessListBytes`](../README.md#accesslistbytes)

#### Defined in

[tx/src/eip2930Transaction.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L46)

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Defined in

[tx/src/eip2930Transaction.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L45)

___

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

[tx/src/eip2930Transaction.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L50)

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

[tx/src/eip2930Transaction.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L48)

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

[tx/src/eip2930Transaction.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L372)

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

[tx/src/eip2930Transaction.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L180)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getHashedMessageToSign

#### Defined in

[tx/src/eip2930Transaction.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L273)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getMessageToSign

#### Defined in

[tx/src/eip2930Transaction.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L260)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

[tx/src/eip2930Transaction.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L302)

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

[tx/src/eip2930Transaction.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L309)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Overrides

BaseTransaction.getUpfrontCost

#### Defined in

[tx/src/eip2930Transaction.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L201)

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
Use [getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.hash

#### Defined in

[tx/src/eip2930Transaction.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L283)

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

▸ **raw**(): `AccessListEIP2930TxValuesArray`

Returns a Uint8Array Array of the raw Bytess of the EIP-2930 transaction, in order.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

Use [serialize](AccessListEIP2930Transaction.md#serialize) to add a transaction to a block
with Block.fromValuesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign).

#### Returns

`AccessListEIP2930TxValuesArray`

#### Overrides

BaseTransaction.raw

#### Defined in

[tx/src/eip2930Transaction.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L218)

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-2930 transaction.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.serialize

#### Defined in

[tx/src/eip2930Transaction.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L244)

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
| `privateKey` | `Uint8Array` |

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

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

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

BaseTransaction.toJSON

#### Defined in

[tx/src/eip2930Transaction.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L357)

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

▸ `Static` **fromSerializedTx**(`serialized`, `opts?`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

[tx/src/eip2930Transaction.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L72)

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

[tx/src/eip2930Transaction.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L62)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `AccessListEIP2930TxValuesArray` |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

[tx/src/eip2930Transaction.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L96)
