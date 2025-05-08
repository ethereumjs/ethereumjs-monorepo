[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP2930CompatibleTx

# Interface: EIP2930CompatibleTx\<T\>

Defined in: [types.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L244)

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

Defined in: [types.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L246)

***

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`cache`](EIP2718CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`chainId`](EIP2718CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L194)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`common`](EIP2718CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`data`](EIP2718CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L196)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`gasLimit`](EIP2718CompatibleTx.md#gaslimit)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L195)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`nonce`](EIP2718CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`r`](EIP2718CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L202)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`s`](EIP2718CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`to`](EIP2718CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`txOptions`](EIP2718CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L205)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`type`](EIP2718CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L200)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`v`](EIP2718CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`value`](EIP2718CompatibleTx.md#value)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`addSignature`](EIP2718CompatibleTx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L225)

#### Returns

`string`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`errorStr`](EIP2718CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L208)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getDataGas`](EIP2718CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getHashedMessageToSign`](EIP2718CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L207)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getIntrinsicGas`](EIP2718CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getMessageToSign`](EIP2718CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getMessageToVerifySignature`](EIP2718CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L221)

#### Returns

`Address`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getSenderAddress`](EIP2718CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L222)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getSenderPublicKey`](EIP2718CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L209)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getUpfrontCost`](EIP2718CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L217)

#### Returns

`string`[]

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getValidationErrors`](EIP2718CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L215)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`hash`](EIP2718CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L218)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`isSigned`](EIP2718CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L219)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`isValid`](EIP2718CompatibleTx.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L211)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`raw`](EIP2718CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L212)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`serialize`](EIP2718CompatibleTx.md#serialize)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`sign`](EIP2718CompatibleTx.md#sign)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`supports`](EIP2718CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L210)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`toCreationAddress`](EIP2718CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L224)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`toJSON`](EIP2718CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L220)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`verifySignature`](EIP2718CompatibleTx.md#verifysignature)
