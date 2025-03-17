[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EIP7702CompatibleTx

# Interface: EIP7702CompatibleTx\<T\>

Defined in: [types.ts:262](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

## Extends

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)\<`T`\>

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md) = [`TransactionType`](../enumerations/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [types.ts:241](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L241)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`accessList`](EIP1559CompatibleTx.md#accesslist)

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

Defined in: [types.ts:242](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L242)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`AccessListJSON`](EIP1559CompatibleTx.md#accesslistjson)

***

### authorizationList

> `readonly` **authorizationList**: [`AuthorizationListBytes`](../type-aliases/AuthorizationListBytes.md)

Defined in: [types.ts:265](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L265)

***

### cache

> `readonly` **cache**: [`TransactionCache`](TransactionCache.md)

Defined in: [types.ts:198](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`cache`](EIP1559CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [types.ts:235](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L235)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`chainId`](EIP1559CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: [types.ts:189](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L189)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`common`](EIP1559CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [types.ts:194](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L194)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`data`](EIP1559CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [types.ts:191](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`gasLimit`](EIP1559CompatibleTx.md#gaslimit)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: [types.ts:248](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L248)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxFeePerGas`](EIP1559CompatibleTx.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: [types.ts:247](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxPriorityFeePerGas`](EIP1559CompatibleTx.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [types.ts:190](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L190)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`nonce`](EIP1559CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: [types.ts:196](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L196)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`r`](EIP1559CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: [types.ts:197](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`s`](EIP1559CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: [types.ts:192](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L192)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`to`](EIP1559CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: [types.ts:201](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`txOptions`](EIP1559CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: [types.ts:200](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L200)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`type`](EIP1559CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: [types.ts:195](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L195)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`v`](EIP1559CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [types.ts:193](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`value`](EIP1559CompatibleTx.md#value)

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

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`addSignature`](EIP1559CompatibleTx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [types.ts:220](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L220)

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`errorStr`](EIP1559CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [types.ts:203](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getDataGas`](EIP1559CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [types.ts:209](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L209)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getHashedMessageToSign`](EIP1559CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [types.ts:202](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L202)

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getIntrinsicGas`](EIP1559CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [types.ts:236](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L236)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToSign`](EIP1559CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [types.ts:211](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L211)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToVerifySignature`](EIP1559CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: [types.ts:216](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

#### Returns

`Address`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderAddress`](EIP1559CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [types.ts:217](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L217)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderPublicKey`](EIP1559CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [types.ts:204](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L204)

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getUpfrontCost`](EIP1559CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [types.ts:212](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L212)

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getValidationErrors`](EIP1559CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [types.ts:210](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L210)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`hash`](EIP1559CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [types.ts:213](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L213)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isSigned`](EIP1559CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [types.ts:214](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isValid`](EIP1559CompatibleTx.md#isvalid)

***

### raw()

> **raw**(): [`TxValuesArray`](TxValuesArray.md)\[`T`\]

Defined in: [types.ts:206](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

#### Returns

[`TxValuesArray`](TxValuesArray.md)\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`raw`](EIP1559CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [types.ts:207](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L207)

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`serialize`](EIP1559CompatibleTx.md#serialize)

***

### sign()

> **sign**(`privateKey`): [`Transaction`](Transaction.md)\[`T`\]

Defined in: [types.ts:218](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L218)

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

[`Transaction`](Transaction.md)\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`sign`](EIP1559CompatibleTx.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [types.ts:199](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

#### Parameters

##### capability

[`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`supports`](EIP1559CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [types.ts:205](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L205)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toCreationAddress`](EIP1559CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: [types.ts:219](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L219)

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toJSON`](EIP1559CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [types.ts:215](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L215)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`verifySignature`](EIP1559CompatibleTx.md#verifysignature)
