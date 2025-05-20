[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTx

# Class: LegacyTx

Defined in: [legacy/tx.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L82)

An Ethereum non-typed (legacy) transaction

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<*typeof* [`Legacy`](../variables/TransactionType.md#legacy)\>

## Constructors

### Constructor

> **new LegacyTx**(`txData`, `opts`): `LegacyTx`

Defined in: [legacy/tx.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L123)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

[`LegacyTxData`](../type-aliases/LegacyTxData.md)

##### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

#### Returns

`LegacyTx`

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [legacy/tx.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L107)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### common

> `readonly` **common**: `Common`

Defined in: [legacy/tx.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L102)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [legacy/tx.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L91)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [legacy/tx.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L89)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

Defined in: [legacy/tx.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L87)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [legacy/tx.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L88)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [legacy/tx.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L96)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [legacy/tx.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L97)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [legacy/tx.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L92)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [legacy/tx.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L105)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `0` = `TransactionType.Legacy`

Defined in: [legacy/tx.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L84)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [legacy/tx.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L95)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [legacy/tx.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L90)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`): `LegacyTx`

Defined in: [legacy/tx.ts:335](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L335)

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### convertV

`boolean` = `false`

#### Returns

`LegacyTx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [legacy/tx.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L407)

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [legacy/tx.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L279)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee?`): `bigint`

Defined in: [legacy/tx.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L191)

#### Parameters

##### baseFee?

`bigint`

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [legacy/tx.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L271)

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getHashedMessageToSign`](../interfaces/TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [legacy/tx.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L297)

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

> **getMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [legacy/tx.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L248)

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

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToSign`](../interfaces/TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [legacy/tx.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L320)

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [legacy/tx.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L396)

#### Returns

`Address`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [legacy/tx.ts:331](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L331)

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [legacy/tx.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L303)

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getUpfrontCost`](../interfaces/TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [legacy/tx.ts:384](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L384)

#### Returns

`string`[]

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [legacy/tx.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L313)

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

Defined in: [legacy/tx.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L187)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [legacy/tx.ts:388](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L388)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): `LegacyTxValuesArray`

Defined in: [legacy/tx.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L208)

Returns a Uint8Array Array of the raw Bytes of the legacy transaction, in order.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

For legacy txs this is also the correct format to add transactions
to a block with createBlockFromBytesArray (use the `serialize()` method
for typed txs).

For an unsigned tx this method returns the empty Bytes values
for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
representation have a look at Transaction.getMessageToSign.

#### Returns

`LegacyTxValuesArray`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`raw`](../interfaces/TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [legacy/tx.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L231)

Returns the serialized encoding of the legacy transaction.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

For an unsigned tx this method uses the empty Uint8Array values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use Transaction.getMessageToSign.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`serialize`](../interfaces/TransactionInterface.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy`): `LegacyTx`

Defined in: [legacy/tx.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L400)

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`LegacyTx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [legacy/tx.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L183)

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

Defined in: [legacy/tx.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L287)

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [legacy/tx.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L375)

Returns an object with the JSON representation of the transaction.

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [legacy/tx.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L392)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
