[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / Blob4844Tx

# Class: Blob4844Tx

Defined in: [4844/tx.ts:47](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L47)

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 3
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<[`BlobEIP4844`](../enumerations/TransactionType.md#blobeip4844)\>

## Constructors

### new Blob4844Tx()

> **new Blob4844Tx**(`txData`, `opts`): [`Blob4844Tx`](Blob4844Tx.md)

Defined in: [4844/tx.ts:96](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L96)

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

[`Blob4844Tx`](Blob4844Tx.md)

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [4844/tx.ts:56](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L56)

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

Defined in: [4844/tx.ts:74](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L74)

***

### blobs?

> `optional` **blobs**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:70](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L70)

***

### blobVersionedHashes

> **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:61](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L61)

***

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [4844/tx.ts:80](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L80)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [4844/tx.ts:57](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L57)

***

### common

> `readonly` **common**: `Common`

Defined in: [4844/tx.ts:76](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L76)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [4844/tx.ts:54](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L54)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [4844/tx.ts:52](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L52)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:71](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L71)

***

### kzgProofs?

> `optional` **kzgProofs**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:72](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L72)

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: [4844/tx.ts:60](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L60)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [4844/tx.ts:59](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L59)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [4844/tx.ts:58](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L58)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [4844/tx.ts:51](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L51)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [4844/tx.ts:65](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L65)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [4844/tx.ts:66](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L66)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [4844/tx.ts:55](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L55)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [4844/tx.ts:78](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L78)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `number` = `TransactionType.BlobEIP4844`

Defined in: [4844/tx.ts:48](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L48)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [4844/tx.ts:64](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L64)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [4844/tx.ts:53](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L53)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`): [`Blob4844Tx`](Blob4844Tx.md)

Defined in: [4844/tx.ts:391](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L391)

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

[`Blob4844Tx`](Blob4844Tx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [4844/tx.ts:457](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L457)

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [4844/tx.ts:235](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L235)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: [4844/tx.ts:228](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L228)

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

Defined in: [4844/tx.ts:351](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L351)

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

Defined in: [4844/tx.ts:262](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L262)

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

Defined in: [4844/tx.ts:340](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L340)

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

Defined in: [4844/tx.ts:365](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L365)

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [4844/tx.ts:437](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L437)

#### Returns

`Address`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [4844/tx.ts:372](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L372)

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`): `bigint`

Defined in: [4844/tx.ts:243](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L243)

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

Defined in: [4844/tx.ts:425](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L425)

#### Returns

`string`[]

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [4844/tx.ts:361](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L361)

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [Blob4844Tx.getMessageToSign](Blob4844Tx.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`hash`](../interfaces/TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [4844/tx.ts:445](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L445)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [4844/tx.ts:429](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L429)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: [4844/tx.ts:466](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L466)

#### Returns

`number`

the number of blobs included with this transaction

***

### raw()

> **raw**(): `BlobEIP4844TxValuesArray`

Defined in: [4844/tx.ts:279](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L279)

Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.

Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.

Use [Blob4844Tx.serialize](Blob4844Tx.md#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [Blob4844Tx.getMessageToSign](Blob4844Tx.md#getmessagetosign).

#### Returns

`BlobEIP4844TxValuesArray`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`raw`](../interfaces/TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [4844/tx.ts:308](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L308)

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

Defined in: [4844/tx.ts:315](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L315)

#### Returns

`Uint8Array`

the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)

***

### sign()

> **sign**(`privateKey`): [`Blob4844Tx`](Blob4844Tx.md)

Defined in: [4844/tx.ts:441](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L441)

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

[`Blob4844Tx`](Blob4844Tx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [4844/tx.ts:220](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L220)

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

Defined in: [4844/tx.ts:252](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L252)

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [4844/tx.ts:376](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L376)

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [4844/tx.ts:433](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L433)

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
