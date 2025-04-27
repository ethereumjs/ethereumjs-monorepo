[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTxInterface

# Interface: LegacyTxInterface\<T\>

Defined in: [types.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L218)

## Extends

- [`TransactionInterface`](TransactionInterface.md)\<`T`\>

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L186)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`cache`](TransactionInterface.md#cache)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L177)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`common`](TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L182)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`data`](TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`gasLimit`](TransactionInterface.md#gaslimit)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L178)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`nonce`](TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L184)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`r`](TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L185)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`s`](TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L180)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`to`](TransactionInterface.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L189)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`txOptions`](TransactionInterface.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L188)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`type`](TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L183)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`v`](TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L181)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`value`](TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L210)

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

[`TransactionInterface`](TransactionInterface.md).[`addSignature`](TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L208)

#### Returns

`string`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`errorStr`](TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

#### Returns

`bigint`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getDataGas`](TransactionInterface.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getHashedMessageToSign`](TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L190)

#### Returns

`bigint`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getIntrinsicGas`](TransactionInterface.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [types.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L196)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getMessageToSign`](TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getMessageToVerifySignature`](TransactionInterface.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L204)

#### Returns

`Address`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getSenderAddress`](TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L205)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getSenderPublicKey`](TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L192)

#### Returns

`bigint`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getUpfrontCost`](TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L200)

#### Returns

`string`[]

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getValidationErrors`](TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`hash`](TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`isSigned`](TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L202)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`isValid`](TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L194)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`raw`](TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L195)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`serialize`](TransactionInterface.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`sign`](TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [types.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L187)

#### Parameters

##### capability

`number`

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`supports`](TransactionInterface.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`toCreationAddress`](TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L207)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`toJSON`](TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`verifySignature`](TransactionInterface.md#verifysignature)
