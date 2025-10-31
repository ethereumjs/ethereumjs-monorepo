[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / Blob4844Tx

# Class: Blob4844Tx

Defined in: [4844/tx.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L63)

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 3
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

This tx type has two "modes": the plain canonical format only contains `blobVersionedHashes`.
If blobs are passed in the tx automatically switches to "Network Wrapper" format and the
`networkWrapperVersion` will be set or validated.

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<*typeof* [`BlobEIP4844`](../variables/TransactionType.md#blobeip4844)\>

## Constructors

### Constructor

> **new Blob4844Tx**(`txData`, `opts`): `Blob4844Tx`

Defined in: [4844/tx.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L119)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static constructors or factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

[`BlobEIP4844TxData`](../interfaces/BlobEIP4844TxData.md)

##### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

#### Returns

`Blob4844Tx`

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [4844/tx.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L72)

***

### blobs?

> `optional` **blobs**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L95)

***

### blobVersionedHashes

> **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L77)

***

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [4844/tx.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L103)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [4844/tx.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L73)

***

### common

> `readonly` **common**: `Common`

Defined in: [4844/tx.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L99)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [4844/tx.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L70)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [4844/tx.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L68)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L96)

***

### kzgProofs?

> `optional` **kzgProofs**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L97)

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: [4844/tx.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L76)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [4844/tx.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L75)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [4844/tx.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L74)

***

### networkWrapperVersion?

> `optional` **networkWrapperVersion**: [`NetworkWrapperType`](../type-aliases/NetworkWrapperType.md)

Defined in: [4844/tx.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L92)

This property is set if the tx is in "Network Wrapper" format.

Possible values:
- 0 (EIP-4844)
- 1 (EIP-4844 + EIP-7594)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [4844/tx.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L67)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [4844/tx.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L81)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [4844/tx.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L82)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [4844/tx.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L71)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [4844/tx.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L101)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `3` = `TransactionType.BlobEIP4844`

Defined in: [4844/tx.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L64)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [4844/tx.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L80)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [4844/tx.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L69)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `Blob4844Tx`

Defined in: [4844/tx.ts:504](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L504)

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Blob4844Tx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [4844/tx.ts:566](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L566)

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [4844/tx.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L337)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: [4844/tx.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L330)

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

Defined in: [4844/tx.ts:464](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L464)

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

Defined in: [4844/tx.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L361)

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

Defined in: [4844/tx.ts:453](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L453)

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

Defined in: [4844/tx.ts:478](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L478)

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [4844/tx.ts:546](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L546)

#### Returns

`Address`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [4844/tx.ts:485](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L485)

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`): `bigint`

Defined in: [4844/tx.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L345)

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

Defined in: [4844/tx.ts:534](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L534)

#### Returns

`string`[]

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [4844/tx.ts:474](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L474)

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [Blob4844Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`hash`](../interfaces/TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [4844/tx.ts:554](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L554)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [4844/tx.ts:538](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L538)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: [4844/tx.ts:575](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L575)

#### Returns

`number`

the number of blobs included with this transaction

***

### raw()

> **raw**(): `BlobEIP4844TxValuesArray`

Defined in: [4844/tx.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L378)

Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.

Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.

Use [Blob4844Tx.serialize](#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [Blob4844Tx.getMessageToSign](#getmessagetosign).

#### Returns

`BlobEIP4844TxValuesArray`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`raw`](../interfaces/TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [4844/tx.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L407)

Returns the serialized encoding of the EIP-4844 transaction.

Format: `0x03 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`.

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`serialize`](../interfaces/TransactionInterface.md#serialize)

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

Defined in: [4844/tx.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L416)

#### Returns

`Uint8Array`

the serialized form of a blob transaction in the network wrapper format
This format is used for gossipping mempool transactions over devp2p or when
submitting a transaction via RPC.

***

### sign()

> **sign**(`privateKey`, `extraEntropy`): `Blob4844Tx`

Defined in: [4844/tx.ts:550](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L550)

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Blob4844Tx`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [4844/tx.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L322)

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

> **toCreationAddress**(): `never`

Defined in: [4844/tx.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L351)

Blob4844Tx cannot create contracts

#### Returns

`never`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [4844/tx.ts:489](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L489)

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [4844/tx.ts:542](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L542)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
