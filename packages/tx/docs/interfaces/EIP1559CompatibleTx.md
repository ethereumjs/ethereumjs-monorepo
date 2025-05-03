[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

Defined in: [types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L249)

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

Defined in: [types.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L246)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`accessList`](EIP2930CompatibleTx.md#accesslist)

***

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`cache`](EIP2930CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`chainId`](EIP2930CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L194)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`common`](EIP2930CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`data`](EIP2930CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L196)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`gasLimit`](EIP2930CompatibleTx.md#gaslimit)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L195)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`nonce`](EIP2930CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`r`](EIP2930CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L202)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`s`](EIP2930CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`to`](EIP2930CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`txOptions`](EIP2930CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L205)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`type`](EIP2930CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L200)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`v`](EIP2930CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`value`](EIP2930CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L227)

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

Defined in: [types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L225)

#### Returns

`string`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`errorStr`](EIP2930CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L208)

#### Returns

`bigint`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getDataGas`](EIP2930CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getHashedMessageToSign`](EIP2930CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L207)

#### Returns

`bigint`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getIntrinsicGas`](EIP2930CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getMessageToSign`](EIP2930CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getMessageToVerifySignature`](EIP2930CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L221)

#### Returns

`Address`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getSenderAddress`](EIP2930CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L222)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getSenderPublicKey`](EIP2930CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L209)

#### Returns

`bigint`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getUpfrontCost`](EIP2930CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L217)

#### Returns

`string`[]

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`getValidationErrors`](EIP2930CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L215)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`hash`](EIP2930CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L218)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`isSigned`](EIP2930CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L219)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`isValid`](EIP2930CompatibleTx.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L211)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`raw`](EIP2930CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L212)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`serialize`](EIP2930CompatibleTx.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L223)

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

Defined in: [types.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L204)

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

Defined in: [types.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L210)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`toCreationAddress`](EIP2930CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L224)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`toJSON`](EIP2930CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L220)

#### Returns

`boolean`

#### Inherited from

[`EIP2930CompatibleTx`](EIP2930CompatibleTx.md).[`verifySignature`](EIP2930CompatibleTx.md#verifysignature)
