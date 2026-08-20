[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP2718CompatibleTx

# Interface: EIP2718CompatibleTx\<T\>

Defined in: [types.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L280)

EIP-2718 typed transaction with an explicit `chainId`.

## Extends

- [`TransactionInterface`](TransactionInterface.md)\<`T`\>

## Extended by

- [`EIP2930CompatibleTx`](EIP2930CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L238)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`cache`](TransactionInterface.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L282)

***

### common

> `readonly` **common**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`common`](TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L234)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`data`](TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L231)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`gasLimit`](TransactionInterface.md#gaslimit)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L230)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`nonce`](TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: [types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L236)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`r`](TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`s`](TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L232)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`to`](TransactionInterface.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`txOptions`](TransactionInterface.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`type`](TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: [types.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L235)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`v`](TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L233)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`value`](TransactionInterface.md#value)

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

[`TransactionInterface`](TransactionInterface.md).[`addSignature`](TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L265)

#### Returns

`string`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`errorStr`](TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L248)

#### Returns

`bigint`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getDataGas`](TransactionInterface.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L254)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getHashedMessageToSign`](TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L242)

#### Returns

`bigint`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getIntrinsicGas`](TransactionInterface.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L283)

#### Returns

`Uint8Array`

#### Overrides

[`TransactionInterface`](TransactionInterface.md).[`getMessageToSign`](TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L256)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getMessageToVerifySignature`](TransactionInterface.md#getmessagetoverifysignature)

***

### getMinimumGasLimit()

> **getMinimumGasLimit**(): `bigint`

Defined in: [types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

`max(intrinsic, calldata floor)` when EIP-7623 is active, otherwise intrinsic.
Does not include EIP-8037 first-touch state gas.

#### Returns

`bigint`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getMinimumGasLimit`](TransactionInterface.md#getminimumgaslimit)

***

### getSenderAddress()

> **getSenderAddress**(): [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L261)

#### Returns

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getSenderAddress`](TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getSenderPublicKey`](TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L249)

#### Returns

`bigint`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getUpfrontCost`](TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L257)

#### Returns

`string`[]

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`getValidationErrors`](TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L255)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`hash`](TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`isSigned`](TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`isValid`](TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`raw`](TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

#### Returns

`Uint8Array`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`serialize`](TransactionInterface.md#serialize)

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

[`TransactionInterface`](TransactionInterface.md).[`sign`](TransactionInterface.md#sign)

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

[`TransactionInterface`](TransactionInterface.md).[`supports`](TransactionInterface.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L250)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`toCreationAddress`](TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`toJSON`](TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L260)

#### Returns

`boolean`

#### Inherited from

[`TransactionInterface`](TransactionInterface.md).[`verifySignature`](TransactionInterface.md#verifysignature)
