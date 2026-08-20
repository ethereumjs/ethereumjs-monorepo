[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTx

# Class: LegacyTx

Defined in: [legacy/tx.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L84)

An Ethereum non-typed (legacy) transaction

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<*typeof* [`Legacy`](../variables/TransactionType.md#legacy)\>

## Constructors

### Constructor

> **new LegacyTx**(`txData`, `opts?`): `LegacyTx`

Defined in: [legacy/tx.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L125)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the module-level factory functions such as [createLegacyTx](../functions/createLegacyTx.md),
[createLegacyTxFromRLP](../functions/createLegacyTxFromRLP.md), and [createLegacyTxFromBytesArray](../functions/createLegacyTxFromBytesArray.md).

#### Parameters

##### txData

[`LegacyTxData`](../type-aliases/LegacyTxData.md)

##### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

#### Returns

`LegacyTx`

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [legacy/tx.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L109)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### common

> `readonly` **common**: `Common`

Defined in: [legacy/tx.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L104)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [legacy/tx.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L93)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [legacy/tx.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L91)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

Defined in: [legacy/tx.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L89)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [legacy/tx.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L90)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: [legacy/tx.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L98)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: [legacy/tx.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L99)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to?**: `Address`

Defined in: [legacy/tx.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L94)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [legacy/tx.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L107)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `0` = `TransactionType.Legacy`

Defined in: [legacy/tx.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L86)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: [legacy/tx.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L97)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [legacy/tx.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L92)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): `LegacyTx`

Defined in: [legacy/tx.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L368)

Adds a signature (or replaces an existing one) and returns a new transaction instance.

#### Parameters

##### v

`bigint`

Recovery parameter, potentially unconverted when `convertV` is false

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

`r` value of the signature

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

`s` value of the signature

##### convertV?

`boolean` = `false`

When true, converts the recovery ID into the appropriate legacy `v`

#### Returns

`LegacyTx`

A new `LegacyTx` that includes the provided signature

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [legacy/tx.ts:464](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L464)

Return a compact error string representation of the object

#### Returns

`string`

Human-readable error summary

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [legacy/tx.ts:292](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L292)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee?`): `bigint`

Defined in: [legacy/tx.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L202)

Computes the effective priority fee for this legacy transaction, optionally considering a base fee.

#### Parameters

##### baseFee?

`bigint`

Optional base fee used on networks that emulate 1559-style pricing

#### Returns

`bigint`

Priority fee portion denominated in wei

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [legacy/tx.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L284)

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

Hash of the unsigned transaction payload

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getHashedMessageToSign`](../interfaces/TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [legacy/tx.ts:310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L310)

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

Defined in: [legacy/tx.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L260)

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

Array representing the unsigned transaction fields

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToSign`](../interfaces/TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [legacy/tx.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L344)

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

Hash used when verifying the signature

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getMinimumGasLimit()

> **getMinimumGasLimit**(): `bigint`

Defined in: [legacy/tx.ts:318](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L318)

`max(getIntrinsicGas(), calldata floor)` when EIP-7623 is active, otherwise intrinsic.
Does not include EIP-8037 first-touch state gas.

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMinimumGasLimit`](../interfaces/TransactionInterface.md#getminimumgaslimit)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [legacy/tx.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L446)

Returns the recovered sender address.

#### Returns

`Address`

Sender Address

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [legacy/tx.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L356)

Returns the public key of the sender

#### Returns

`Uint8Array`

Sender public key

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [legacy/tx.ts:325](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L325)

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getUpfrontCost`](../interfaces/TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [legacy/tx.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L422)

Validates the transaction and returns any encountered errors.

#### Returns

`string`[]

Array containing validation error messages

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [legacy/tx.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L336)

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`hash`](../interfaces/TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [legacy/tx.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L193)

Indicates whether the transaction already contains signature values.

#### Returns

`boolean`

true if `v`, `r`, and `s` are populated

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [legacy/tx.ts:430](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L430)

Determines whether the transaction passes all validation checks.

#### Returns

`boolean`

true if no validation errors were found

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): `LegacyTxValuesArray`

Defined in: [legacy/tx.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L219)

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

Defined in: [legacy/tx.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L242)

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

> **sign**(`privateKey`, `extraEntropy?`): `LegacyTx`

Defined in: [legacy/tx.ts:456](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L456)

Signs the transaction with the provided private key and returns the new signed instance.

#### Parameters

##### privateKey

`Uint8Array`

32-byte private key used to sign the transaction

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

Optional entropy passed to the signing routine

#### Returns

`LegacyTx`

A new signed `LegacyTx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [legacy/tx.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L185)

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

Defined in: [legacy/tx.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L300)

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [legacy/tx.ts:409](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L409)

Returns an object with the JSON representation of the transaction.

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

JSON encoding of the transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [legacy/tx.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/tx.ts#L438)

Checks whether the stored signature can be successfully verified.

#### Returns

`boolean`

true if the signature is valid

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
