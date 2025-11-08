[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

Defined in: [types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L267)

## Extends

- [`EIP2930CompatibleTx`](EIP2930CompatibleTx.md)\<`T`\>

## Extended by

- [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md)
- [`EIP7702CompatibleTx`](EIP7702CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`accessList`](EIP2930CompatibleTx.md#accesslist)

***

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L221)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`cache`](EIP2930CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`chainId`](EIP2930CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L212)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`common`](EIP2930CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L217)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`data`](EIP2930CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`gasLimit`](EIP2930CompatibleTx.md#gaslimit)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [types.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L270)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [types.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L269)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L213)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`nonce`](EIP2930CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L219)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`r`](EIP2930CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L220)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`s`](EIP2930CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L215)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`to`](EIP2930CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L224)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`txOptions`](EIP2930CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L223)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`type`](EIP2930CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L218)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`v`](EIP2930CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`value`](EIP2930CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L245)

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### convertV?

`boolean`

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`addSignature`](EIP2930CompatibleTx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L243)

#### Returns

`string`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`errorStr`](EIP2930CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L226)

#### Returns

`bigint`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getDataGas`](EIP2930CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L232)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getHashedMessageToSign`](EIP2930CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L225)

#### Returns

`bigint`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getIntrinsicGas`](EIP2930CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getMessageToSign`](EIP2930CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L234)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getMessageToVerifySignature`](EIP2930CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L239)

#### Returns

`Address`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getSenderAddress`](EIP2930CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getSenderPublicKey`](EIP2930CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L227)

#### Returns

`bigint`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getUpfrontCost`](EIP2930CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L235)

#### Returns

`string`[]

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getValidationErrors`](EIP2930CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L233)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`hash`](EIP2930CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L236)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`isSigned`](EIP2930CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`isValid`](EIP2930CompatibleTx.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`raw`](EIP2930CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L230)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`serialize`](EIP2930CompatibleTx.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`sign`](EIP2930CompatibleTx.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [types.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L222)

#### Parameters

##### capability

`number`

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`supports`](EIP2930CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L228)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`toCreationAddress`](EIP2930CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L242)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`toJSON`](EIP2930CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L238)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`verifySignature`](EIP2930CompatibleTx.md#verifysignature)
