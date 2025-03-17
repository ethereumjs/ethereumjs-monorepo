[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / TransactionInterface

# Interface: TransactionInterface\<T\>

Defined in: [types.ts:188](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L188)

## Extended by

- [`LegacyTxInterface`](LegacyTxInterface.md)
- [`EIP2718CompatibleTx`](EIP2718CompatibleTx.md)

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md) = [`TransactionType`](../enumerations/TransactionType.md)

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:198](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:189](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L189)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:194](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L194)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:191](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:190](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L190)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:196](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L196)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:197](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:192](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L192)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:201](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: [types.ts:200](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L200)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:195](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L195)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:193](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:222](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L222)

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`

##### s

`bigint` | `Uint8Array`

##### convertV?

`boolean`

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:220](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L220)

#### Returns

`string`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:203](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:209](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L209)

#### Returns

`Uint8Array`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:202](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L202)

#### Returns

`bigint`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array` \| `Uint8Array`[]

Defined in: [types.ts:208](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L208)

#### Returns

`Uint8Array` \| `Uint8Array`[]

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:211](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L211)

#### Returns

`Uint8Array`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:216](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

#### Returns

`Address`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:217](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L217)

#### Returns

`Uint8Array`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:204](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L204)

#### Returns

`bigint`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:212](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L212)

#### Returns

`string`[]

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:210](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L210)

#### Returns

`Uint8Array`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:213](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L213)

#### Returns

`boolean`

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:214](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

#### Returns

`boolean`

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:206](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:207](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L207)

#### Returns

`Uint8Array`

***

### sign()

> **sign**(`privateKey`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:218](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L218)

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [types.ts:199](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

#### Parameters

##### capability

[`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:205](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L205)

#### Returns

`boolean`

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:219](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L219)

#### Returns

[`JSONTx`](JSONTx.md)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:215](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L215)

#### Returns

`boolean`
