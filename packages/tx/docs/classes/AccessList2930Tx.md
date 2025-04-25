[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / AccessList2930Tx

# Class: AccessList2930Tx

Defined in: [2930/tx.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L41)

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<*typeof* [`AccessListEIP2930`](../variables/TransactionType.md#accesslisteip2930)\>

## Constructors

### Constructor

> **new AccessList2930Tx**(`txData`, `opts`): `AccessList2930Tx`

Defined in: [2930/tx.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L83)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

[`AccessList2930TxData`](../interfaces/AccessList2930TxData.md)

##### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

#### Returns

`AccessList2930Tx`

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [2930/tx.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L53)

***

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [2930/tx.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L67)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [2930/tx.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L54)

***

### common

> `readonly` **common**: `Common`

Defined in: [2930/tx.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L63)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [2930/tx.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L51)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [2930/tx.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L49)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

Defined in: [2930/tx.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L47)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [2930/tx.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L48)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [2930/tx.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L58)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [2930/tx.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L59)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [2930/tx.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L52)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [2930/tx.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L65)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `1` = `TransactionType.AccessListEIP2930`

Defined in: [2930/tx.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L44)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [2930/tx.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L57)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [2930/tx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L50)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `AccessList2930Tx`

Defined in: [2930/tx.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L273)

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`AccessList2930Tx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [2930/tx.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L338)

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [2930/tx.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L151)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee?`): `bigint`

Defined in: [2930/tx.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L144)

#### Parameters

##### baseFee?

`bigint`

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [2930/tx.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L245)

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getHashedMessageToSign`](../interfaces/TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [2930/tx.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L168)

The minimum gas limit which the tx to have to be valid.
This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
the optional creation fee (if the transaction creates a contract), and if relevant the gas
to be paid for access lists (EIP-2930) and authority lists (EIP-7702).

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getIntrinsicGas`](../interfaces/TransactionInterface.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [2930/tx.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L234)

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToSign`](../interfaces/TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [2930/tx.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L262)

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [2930/tx.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L323)

#### Returns

`Address`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [2930/tx.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L269)

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [2930/tx.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L158)

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getUpfrontCost`](../interfaces/TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [2930/tx.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L311)

#### Returns

`string`[]

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [2930/tx.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L255)

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`hash`](../interfaces/TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [2930/tx.ts:331](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L331)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [2930/tx.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L315)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): `AccessList2930TxValuesArray`

Defined in: [2930/tx.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L193)

Returns a Uint8Array Array of the raw Bytes of the EIP-2930 transaction, in order.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

Use [AccessList2930Tx.serialize](#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [AccessList2930Tx.getMessageToSign](#getmessagetosign).

#### Returns

`AccessList2930TxValuesArray`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`raw`](../interfaces/TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [2930/tx.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L219)

Returns the serialized encoding of the EIP-2930 transaction.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`serialize`](../interfaces/TransactionInterface.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy`): `AccessList2930Tx`

Defined in: [2930/tx.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L327)

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`AccessList2930Tx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [2930/tx.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L140)

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

##### capability

`number`

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`supports`](../interfaces/TransactionInterface.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [2930/tx.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L176)

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [2930/tx.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L299)

Returns an object with the JSON representation of the transaction

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [2930/tx.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L319)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
