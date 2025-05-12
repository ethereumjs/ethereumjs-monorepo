[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / FeeMarket1559Tx

# Class: FeeMarket1559Tx

Defined in: [1559/tx.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L43)

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<*typeof* [`FeeMarketEIP1559`](../variables/TransactionType.md#feemarketeip1559)\>

## Constructors

### Constructor

> **new FeeMarket1559Tx**(`txData`, `opts`): `FeeMarket1559Tx`

Defined in: [1559/tx.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L87)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

[`FeeMarketEIP1559TxData`](../interfaces/FeeMarketEIP1559TxData.md)

##### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

#### Returns

`FeeMarket1559Tx`

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [1559/tx.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L55)

***

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [1559/tx.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L71)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [1559/tx.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L56)

***

### common

> `readonly` **common**: `Common`

Defined in: [1559/tx.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L67)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [1559/tx.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L53)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [1559/tx.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L51)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [1559/tx.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L58)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [1559/tx.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L57)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [1559/tx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L50)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [1559/tx.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L62)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [1559/tx.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L63)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [1559/tx.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L54)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [1559/tx.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L69)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `2` = `TransactionType.FeeMarketEIP1559`

Defined in: [1559/tx.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L47)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [1559/tx.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L61)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [1559/tx.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L52)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `FeeMarket1559Tx`

Defined in: [1559/tx.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L297)

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`FeeMarket1559Tx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [1559/tx.ts:369](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L369)

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [1559/tx.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L165)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: [1559/tx.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L173)

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

##### baseFee

`bigint`

Base fee retrieved from block

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [1559/tx.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L269)

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

Defined in: [1559/tx.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L191)

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

Defined in: [1559/tx.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L258)

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

Defined in: [1559/tx.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L286)

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [1559/tx.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L349)

#### Returns

`Address`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [1559/tx.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L293)

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`): `bigint`

Defined in: [1559/tx.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L181)

The up front amount that an account must have for this transaction to be valid

#### Parameters

##### baseFee

`bigint` = `BIGINT_0`

The base fee of the block (will be set to 0 if not provided)

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getUpfrontCost`](../interfaces/TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [1559/tx.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L337)

#### Returns

`string`[]

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [1559/tx.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L279)

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarket1559Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`hash`](../interfaces/TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [1559/tx.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L357)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [1559/tx.ts:341](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L341)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Defined in: [1559/tx.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L216)

Returns a Uint8Array Array of the raw Bytes of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [FeeMarket1559Tx.serialize](#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [FeeMarket1559Tx.getMessageToSign](#getmessagetosign).

#### Returns

`FeeMarketEIP1559TxValuesArray`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`raw`](../interfaces/TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [1559/tx.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L243)

Returns the serialized encoding of the EIP-1559 transaction.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`serialize`](../interfaces/TransactionInterface.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy`): `FeeMarket1559Tx`

Defined in: [1559/tx.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L353)

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`FeeMarket1559Tx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [1559/tx.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L158)

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

Defined in: [1559/tx.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L199)

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [1559/tx.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L324)

Returns an object with the JSON representation of the transaction

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [1559/tx.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/tx.ts#L345)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
