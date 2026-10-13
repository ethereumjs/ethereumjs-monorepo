[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP2930CompatibleTx

# Interface: EIP2930CompatibleTx\<T\>

Defined in: [types.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L287)

EIP-2930 transaction with an access list.

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

Defined in: [types.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L289)

***

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L238)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`cache`](EIP2718CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L282)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`chainId`](EIP2718CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`common`](EIP2718CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L234)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`data`](EIP2718CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L231)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`gasLimit`](EIP2718CompatibleTx.md#gaslimit)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L230)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`nonce`](EIP2718CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: [types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L236)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`r`](EIP2718CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`s`](EIP2718CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L232)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`to`](EIP2718CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`txOptions`](EIP2718CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L240)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`type`](EIP2718CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: [types.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L235)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`v`](EIP2718CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L233)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`value`](EIP2718CompatibleTx.md#value)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`addSignature`](EIP2718CompatibleTx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L265)

#### Returns

`string`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`errorStr`](EIP2718CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L248)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getDataGas`](EIP2718CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L254)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getHashedMessageToSign`](EIP2718CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L242)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getIntrinsicGas`](EIP2718CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L283)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getMessageToSign`](EIP2718CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L256)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getMessageToVerifySignature`](EIP2718CompatibleTx.md#getmessagetoverifysignature)

***

### getMinimumGasLimit()

> **getMinimumGasLimit**(): `bigint`

Defined in: [types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

`max(intrinsic, calldata floor)` when EIP-7623 is active, otherwise intrinsic.
Does not include EIP-8037 first-touch state gas.

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getMinimumGasLimit`](EIP2718CompatibleTx.md#getminimumgaslimit)

***

### getSenderAddress()

> **getSenderAddress**(): [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L261)

#### Returns

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getSenderAddress`](EIP2718CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getSenderPublicKey`](EIP2718CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L249)

#### Returns

`bigint`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getUpfrontCost`](EIP2718CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L257)

#### Returns

`string`[]

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`getValidationErrors`](EIP2718CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L255)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`hash`](EIP2718CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`isSigned`](EIP2718CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`isValid`](EIP2718CompatibleTx.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`raw`](EIP2718CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`serialize`](EIP2718CompatibleTx.md#serialize)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`sign`](EIP2718CompatibleTx.md#sign)

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

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`supports`](EIP2718CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L250)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`toCreationAddress`](EIP2718CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`toJSON`](EIP2718CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L260)

#### Returns

`boolean`

#### Inherited from

[`EIP2718CompatibleTx`](EIP2718CompatibleTx.md).[`verifySignature`](EIP2718CompatibleTx.md#verifysignature)
