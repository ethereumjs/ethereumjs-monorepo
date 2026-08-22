[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / TransactionInterface

# Interface: TransactionInterface\<T\>

Defined in: [types.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L228)

Common method surface shared by all transaction classes.

## Extended by

- [`LegacyTxInterface`](LegacyTxInterface.md)
- [`EIP2718CompatibleTx`](EIP2718CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L238)

***

### common

> `readonly` **common**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L234)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L231)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L230)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: [types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L236)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

***

### to?

> `readonly` `optional` **to?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L232)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: [types.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L235)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L233)

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

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L265)

#### Returns

`string`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L248)

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L254)

#### Returns

`Uint8Array`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L242)

#### Returns

`bigint`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [types.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L253)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L256)

#### Returns

`Uint8Array`

***

### getMinimumGasLimit()

> **getMinimumGasLimit**(): `bigint`

Defined in: [types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

`max(intrinsic, calldata floor)` when EIP-7623 is active, otherwise intrinsic.
Does not include EIP-8037 first-touch state gas.

#### Returns

`bigint`

***

### getSenderAddress()

> **getSenderAddress**(): [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L261)

#### Returns

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

#### Returns

`Uint8Array`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L249)

#### Returns

`bigint`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L257)

#### Returns

`string`[]

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L255)

#### Returns

`Uint8Array`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

#### Returns

`boolean`

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

#### Returns

`boolean`

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

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

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [types.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L239)

#### Parameters

##### capability

`number`

#### Returns

`boolean`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L250)

#### Returns

`boolean`

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

#### Returns

[`JSONTx`](JSONTx.md)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L260)

#### Returns

`boolean`
