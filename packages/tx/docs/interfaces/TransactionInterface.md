[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / TransactionInterface

# Interface: TransactionInterface\<T\>

Defined in: [types.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L176)

## Extended by

- [`LegacyTxInterface`](LegacyTxInterface.md)
- [`EIP2718CompatibleTx`](EIP2718CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L186)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L177)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L182)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L178)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L184)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L185)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L180)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L189)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L188)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L183)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L181)

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

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L208)

#### Returns

`string`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

#### Returns

`Uint8Array`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L190)

#### Returns

`bigint`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [types.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L196)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

#### Returns

`Uint8Array`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L204)

#### Returns

`Address`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L205)

#### Returns

`Uint8Array`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L192)

#### Returns

`bigint`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L200)

#### Returns

`string`[]

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

#### Returns

`Uint8Array`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

#### Returns

`boolean`

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L202)

#### Returns

`boolean`

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L194)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L195)

#### Returns

`Uint8Array`

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

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [types.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L187)

#### Parameters

##### capability

`number`

#### Returns

`boolean`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

#### Returns

`boolean`

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L207)

#### Returns

[`JSONTx`](JSONTx.md)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

#### Returns

`boolean`
