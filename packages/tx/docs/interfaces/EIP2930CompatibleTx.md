[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP2930CompatibleTx

# Interface: EIP2930CompatibleTx\<T\>

Defined in: [types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

## Extends

- [`EIP2718CompatibleTx`](EIP2718CompatibleTx.md)\<`T`\>

## Extended by

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

***

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L221)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`cache`](EIP2718CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`chainId`](EIP2718CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L212)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`common`](EIP2718CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L217)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`data`](EIP2718CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`gasLimit`](EIP2718CompatibleTx.md#gaslimit)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L213)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`nonce`](EIP2718CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L219)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`r`](EIP2718CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L220)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`s`](EIP2718CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L215)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`to`](EIP2718CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L224)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`txOptions`](EIP2718CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L223)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`type`](EIP2718CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L218)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`v`](EIP2718CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`value`](EIP2718CompatibleTx.md#value)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`addSignature`](EIP2718CompatibleTx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L243)

#### Returns

`string`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`errorStr`](EIP2718CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L226)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getDataGas`](EIP2718CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L232)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getHashedMessageToSign`](EIP2718CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L225)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getIntrinsicGas`](EIP2718CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getMessageToSign`](EIP2718CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L234)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getMessageToVerifySignature`](EIP2718CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L239)

#### Returns

`Address`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getSenderAddress`](EIP2718CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getSenderPublicKey`](EIP2718CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L227)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getUpfrontCost`](EIP2718CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L235)

#### Returns

`string`[]

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getValidationErrors`](EIP2718CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L233)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`hash`](EIP2718CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L236)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`isSigned`](EIP2718CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`isValid`](EIP2718CompatibleTx.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`raw`](EIP2718CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L230)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`serialize`](EIP2718CompatibleTx.md#serialize)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`sign`](EIP2718CompatibleTx.md#sign)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`supports`](EIP2718CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L228)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`toCreationAddress`](EIP2718CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L242)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`toJSON`](EIP2718CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L238)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`verifySignature`](EIP2718CompatibleTx.md#verifysignature)
