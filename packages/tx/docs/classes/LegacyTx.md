[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTx

# Class: LegacyTx

Defined in: [legacy/tx.ts:81](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L81)

An Ethereum non-typed (legacy) transaction

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<[`Legacy`](../enumerations/TransactionType.md#legacy)\>

## Constructors

### new LegacyTx()

> **new LegacyTx**(`txData`, `opts`): [`LegacyTx`](LegacyTx.md)

Defined in: [legacy/tx.ts:122](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L122)

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

[`LegacyTx`](LegacyTx.md)

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [legacy/tx.ts:106](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L106)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### common

> `readonly` **common**: `Common`

Defined in: [legacy/tx.ts:101](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L101)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [legacy/tx.ts:90](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L90)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [legacy/tx.ts:88](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L88)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

Defined in: [legacy/tx.ts:86](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L86)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [legacy/tx.ts:87](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L87)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [legacy/tx.ts:95](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L95)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [legacy/tx.ts:96](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L96)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [legacy/tx.ts:91](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L91)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [legacy/tx.ts:104](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L104)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `number` = `TransactionType.Legacy`

Defined in: [legacy/tx.ts:83](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L83)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [legacy/tx.ts:94](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L94)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [legacy/tx.ts:89](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L89)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`): [`LegacyTx`](LegacyTx.md)

Defined in: [legacy/tx.ts:334](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L334)

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`

##### s

`bigint` | `Uint8Array`

##### convertV

`boolean` = `false`

#### Returns

[`LegacyTx`](LegacyTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [legacy/tx.ts:399](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L399)

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [legacy/tx.ts:278](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L278)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`?): `bigint`

Defined in: [legacy/tx.ts:190](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L190)

#### Parameters

##### baseFee?

`bigint`

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [legacy/tx.ts:270](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L270)

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getHashedMessageToSign`](../interfaces/TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [legacy/tx.ts:296](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L296)

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

> **getMessageToSign**(): `Uint8Array`[]

Defined in: [legacy/tx.ts:247](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L247)

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

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToSign`](../interfaces/TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [legacy/tx.ts:319](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L319)

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [legacy/tx.ts:388](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L388)

#### Returns

`Address`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [legacy/tx.ts:330](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L330)

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [legacy/tx.ts:302](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L302)

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getUpfrontCost`](../interfaces/TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [legacy/tx.ts:376](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L376)

#### Returns

`string`[]

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [legacy/tx.ts:312](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L312)

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

Defined in: [legacy/tx.ts:186](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L186)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [legacy/tx.ts:380](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L380)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): `LegacyTxValuesArray`

Defined in: [legacy/tx.ts:207](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L207)

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

Defined in: [legacy/tx.ts:230](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L230)

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

> **sign**(`privateKey`): [`LegacyTx`](LegacyTx.md)

Defined in: [legacy/tx.ts:392](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L392)

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

[`LegacyTx`](LegacyTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [legacy/tx.ts:182](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L182)

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

[`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`supports`](../interfaces/TransactionInterface.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [legacy/tx.ts:286](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L286)

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [legacy/tx.ts:367](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L367)

Returns an object with the JSON representation of the transaction.

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [legacy/tx.ts:384](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L384)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
