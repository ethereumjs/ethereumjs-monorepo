[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / Blob4844Tx

# Class: Blob4844Tx

Defined in: [4844/tx.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L68)

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

> **new Blob4844Tx**(`txData`, `opts?`): `Blob4844Tx`

Defined in: [4844/tx.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L124)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the module-level factory functions such as [createBlob4844Tx](../functions/createBlob4844Tx.md),
[createBlob4844TxFromRLP](../functions/createBlob4844TxFromRLP.md), and [createBlob4844TxFromBytesArray](../functions/createBlob4844TxFromBytesArray.md).

#### Parameters

##### txData

[`BlobEIP4844TxData`](../interfaces/BlobEIP4844TxData.md)

##### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

#### Returns

`Blob4844Tx`

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [4844/tx.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L77)

***

### blobs?

> `optional` **blobs?**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L100)

***

### blobVersionedHashes

> **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L82)

***

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [4844/tx.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L108)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [4844/tx.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L78)

***

### common

> `readonly` **common**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [4844/tx.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L104)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [4844/tx.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L75)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [4844/tx.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L73)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments?**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L101)

***

### kzgProofs?

> `optional` **kzgProofs?**: `` `0x${string}` ``[]

Defined in: [4844/tx.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L102)

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: [4844/tx.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L81)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [4844/tx.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L80)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [4844/tx.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L79)

***

### networkWrapperVersion?

> `optional` **networkWrapperVersion?**: [`NetworkWrapperType`](../type-aliases/NetworkWrapperType.md)

Defined in: [4844/tx.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L97)

This property is set if the tx is in "Network Wrapper" format.

Possible values:
- 0 (EIP-4844)
- 1 (EIP-4844 + EIP-7594)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [4844/tx.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L72)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: [4844/tx.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L86)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: [4844/tx.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L87)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [4844/tx.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L76)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [4844/tx.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L106)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `3` = `TransactionType.BlobEIP4844`

Defined in: [4844/tx.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L69)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: [4844/tx.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L85)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [4844/tx.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L74)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `Blob4844Tx`

Defined in: [4844/tx.ts:545](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L545)

Adds signature values (and optional network wrapper fields) and returns a new transaction.

#### Parameters

##### v

`bigint`

Recovery parameter

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

Signature `r` value

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

Signature `s` value

#### Returns

`Blob4844Tx`

New `Blob4844Tx` instance containing the signature

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [4844/tx.ts:633](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L633)

Return a compact error string representation of the object

#### Returns

`string`

Human-readable error summary

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [4844/tx.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L351)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: [4844/tx.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L344)

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

Defined in: [4844/tx.ts:488](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L488)

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

Keccak hash of the unsigned transaction payload

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getHashedMessageToSign`](../interfaces/TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [4844/tx.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L375)

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

Defined in: [4844/tx.ts:476](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L476)

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Returns

`Uint8Array`

Serialized unsigned transaction payload

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToSign`](../interfaces/TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [4844/tx.ts:507](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L507)

Returns the hashed unsigned transaction that should be used for signature verification.

#### Returns

`Uint8Array`

Hash of the unsigned transaction payload

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getMinimumGasLimit()

> **getMinimumGasLimit**(): `bigint`

Defined in: [4844/tx.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L383)

`max(getIntrinsicGas(), calldata floor)` when EIP-7623 is active, otherwise intrinsic.
Does not include EIP-8037 first-touch state gas.

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMinimumGasLimit`](../interfaces/TransactionInterface.md#getminimumgaslimit)

***

### getSenderAddress()

> **getSenderAddress**(): [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [4844/tx.ts:602](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L602)

Returns the recovered sender address.

#### Returns

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Sender [Address](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [4844/tx.ts:515](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L515)

Returns the public key of the sender

#### Returns

`Uint8Array`

Sender public key

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee?`): `bigint`

Defined in: [4844/tx.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L359)

The up front amount that an account must have for this transaction to be valid

#### Parameters

##### baseFee?

`bigint` = `BIGINT_0`

The base fee of the block (will be set to 0 if not provided)

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getUpfrontCost`](../interfaces/TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [4844/tx.ts:579](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L579)

Returns validation errors for this transaction, if any.

#### Returns

`string`[]

Array of validation error messages

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [4844/tx.ts:499](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L499)

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [Blob4844Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`hash`](../interfaces/TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [4844/tx.ts:620](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L620)

Indicates whether the transaction already carries signature values.

#### Returns

`boolean`

true if signature parts are present

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [4844/tx.ts:586](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L586)

#### Returns

`boolean`

true if the transaction has no validation errors

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: [4844/tx.ts:642](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L642)

#### Returns

`number`

the number of blobs included with this transaction

***

### raw()

> **raw**(): `BlobEIP4844TxValuesArray`

Defined in: [4844/tx.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L400)

Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.

Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.

Use [Blob4844Tx.serialize](#serialize) to add a transaction to a block
with [@ethereumjs/block!createBlockFromBytesArray](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/functions/createBlockFromBytesArray.md).

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

Defined in: [4844/tx.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L429)

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

Defined in: [4844/tx.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L438)

#### Returns

`Uint8Array`

the serialized form of a blob transaction in the network wrapper format
This format is used for gossipping mempool transactions over devp2p or when
submitting a transaction via RPC.

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `Blob4844Tx`

Defined in: [4844/tx.ts:612](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L612)

Signs the transaction with the provided private key and returns the signed instance.

#### Parameters

##### privateKey

`Uint8Array`

32-byte private key used for signing

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

Optional entropy passed to the signing routine

#### Returns

`Blob4844Tx`

Newly signed transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [4844/tx.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L336)

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

Defined in: [4844/tx.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L365)

Blob4844Tx cannot create contracts

#### Returns

`never`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [4844/tx.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L523)

Produces a JSON representation compliant with the execution API.

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

JSON encoding of the transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [4844/tx.ts:594](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/tx.ts#L594)

Verifies whether the attached signature is valid.

#### Returns

`boolean`

true if signature verification succeeds

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
