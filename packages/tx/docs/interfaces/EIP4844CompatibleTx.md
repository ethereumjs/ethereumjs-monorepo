[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP4844CompatibleTx

# Interface: EIP4844CompatibleTx\<T\>

Defined in: [types.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L300)

EIP-4844 blob-carrying transaction.

## Extends

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)\<`T`\>

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [types.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L289)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`accessList`](EIP1559CompatibleTx.md#accesslist)

***

### blobs?

> `optional` **blobs?**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [types.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L304)

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [types.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L303)

***

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L238)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`cache`](EIP1559CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L282)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`chainId`](EIP1559CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`common`](EIP1559CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L234)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`data`](EIP1559CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L231)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`gasLimit`](EIP1559CompatibleTx.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments?**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [types.ts:305](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L305)

***

### kzgProofs?

> `optional` **kzgProofs?**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [types.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L306)

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: [types.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L302)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [types.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L296)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxFeePerGas`](EIP1559CompatibleTx.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [types.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L295)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxPriorityFeePerGas`](EIP1559CompatibleTx.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L230)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`nonce`](EIP1559CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: [types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L236)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`r`](EIP1559CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`s`](EIP1559CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to?**: `Address`

Defined in: [types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L232)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`to`](EIP1559CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`txOptions`](EIP1559CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`type`](EIP1559CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: [types.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L235)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`v`](EIP1559CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L233)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`value`](EIP1559CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L267)

#### Parameters

##### v

`bigint`

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

##### convertV?

`boolean`

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`addSignature`](EIP1559CompatibleTx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L265)

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`errorStr`](EIP1559CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L248)

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getDataGas`](EIP1559CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L254)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getHashedMessageToSign`](EIP1559CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L242)

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getIntrinsicGas`](EIP1559CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L283)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToSign`](EIP1559CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L256)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToVerifySignature`](EIP1559CompatibleTx.md#getmessagetoverifysignature)

***

### getMinimumGasLimit()

> **getMinimumGasLimit**(): `bigint`

Defined in: [types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

`max(intrinsic, calldata floor)` when EIP-7623 is active, otherwise intrinsic.
Does not include EIP-8037 first-touch state gas.

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMinimumGasLimit`](EIP1559CompatibleTx.md#getminimumgaslimit)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L261)

#### Returns

`Address`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderAddress`](EIP1559CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderPublicKey`](EIP1559CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L249)

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getUpfrontCost`](EIP1559CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L257)

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getValidationErrors`](EIP1559CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L255)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`hash`](EIP1559CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isSigned`](EIP1559CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isValid`](EIP1559CompatibleTx.md#isvalid)

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: [types.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L308)

#### Returns

`number`

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`raw`](EIP1559CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`serialize`](EIP1559CompatibleTx.md#serialize)

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

Defined in: [types.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L307)

#### Returns

`Uint8Array`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L263)

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`sign`](EIP1559CompatibleTx.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [types.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L239)

#### Parameters

##### capability

`number`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`supports`](EIP1559CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L250)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toCreationAddress`](EIP1559CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toJSON`](EIP1559CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L260)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`verifySignature`](EIP1559CompatibleTx.md#verifysignature)
