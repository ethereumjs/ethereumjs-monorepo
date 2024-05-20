[@ethereumjs/tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) = [`TransactionType`](../enums/TransactionType.md) |

## Hierarchy

- [`EIP2930CompatibleTx`](EIP2930CompatibleTx.md)<`T`\>

  ↳ **`EIP1559CompatibleTx`**

  ↳↳ [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md)

## Table of contents

### Properties

- [AccessListJSON](EIP1559CompatibleTx.md#accesslistjson)
- [accessList](EIP1559CompatibleTx.md#accesslist)
- [cache](EIP1559CompatibleTx.md#cache)
- [chainId](EIP1559CompatibleTx.md#chainid)
- [common](EIP1559CompatibleTx.md#common)
- [data](EIP1559CompatibleTx.md#data)
- [gasLimit](EIP1559CompatibleTx.md#gaslimit)
- [maxFeePerGas](EIP1559CompatibleTx.md#maxfeepergas)
- [maxPriorityFeePerGas](EIP1559CompatibleTx.md#maxpriorityfeepergas)
- [nonce](EIP1559CompatibleTx.md#nonce)
- [r](EIP1559CompatibleTx.md#r)
- [s](EIP1559CompatibleTx.md#s)
- [to](EIP1559CompatibleTx.md#to)
- [type](EIP1559CompatibleTx.md#type)
- [v](EIP1559CompatibleTx.md#v)
- [value](EIP1559CompatibleTx.md#value)

### Methods

- [errorStr](EIP1559CompatibleTx.md#errorstr)
- [getBaseFee](EIP1559CompatibleTx.md#getbasefee)
- [getDataFee](EIP1559CompatibleTx.md#getdatafee)
- [getHashedMessageToSign](EIP1559CompatibleTx.md#gethashedmessagetosign)
- [getMessageToSign](EIP1559CompatibleTx.md#getmessagetosign)
- [getMessageToVerifySignature](EIP1559CompatibleTx.md#getmessagetoverifysignature)
- [getSenderAddress](EIP1559CompatibleTx.md#getsenderaddress)
- [getSenderPublicKey](EIP1559CompatibleTx.md#getsenderpublickey)
- [getUpfrontCost](EIP1559CompatibleTx.md#getupfrontcost)
- [getValidationErrors](EIP1559CompatibleTx.md#getvalidationerrors)
- [hash](EIP1559CompatibleTx.md#hash)
- [isSigned](EIP1559CompatibleTx.md#issigned)
- [isValid](EIP1559CompatibleTx.md#isvalid)
- [raw](EIP1559CompatibleTx.md#raw)
- [serialize](EIP1559CompatibleTx.md#serialize)
- [sign](EIP1559CompatibleTx.md#sign)
- [supports](EIP1559CompatibleTx.md#supports)
- [toCreationAddress](EIP1559CompatibleTx.md#tocreationaddress)
- [toJSON](EIP1559CompatibleTx.md#tojson)
- [verifySignature](EIP1559CompatibleTx.md#verifysignature)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [`AccessList`](../README.md#accesslist)

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[AccessListJSON](EIP2930CompatibleTx.md#accesslistjson)

#### Defined in

[tx/src/types.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L186)

___

### accessList

• `Readonly` **accessList**: [`AccessListBytes`](../README.md#accesslistbytes)

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[accessList](EIP2930CompatibleTx.md#accesslist)

#### Defined in

[tx/src/types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L185)

___

### cache

• `Readonly` **cache**: [`TransactionCache`](TransactionCache.md)

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[cache](EIP2930CompatibleTx.md#cache)

#### Defined in

[tx/src/types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L150)

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[chainId](EIP2930CompatibleTx.md#chainid)

#### Defined in

[tx/src/types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[common](EIP2930CompatibleTx.md#common)

#### Defined in

[tx/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L141)

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[data](EIP2930CompatibleTx.md#data)

#### Defined in

[tx/src/types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L146)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[gasLimit](EIP2930CompatibleTx.md#gaslimit)

#### Defined in

[tx/src/types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### maxFeePerGas

• `Readonly` **maxFeePerGas**: `bigint`

#### Defined in

[tx/src/types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L192)

___

### maxPriorityFeePerGas

• `Readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

[tx/src/types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[nonce](EIP2930CompatibleTx.md#nonce)

#### Defined in

[tx/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[r](EIP2930CompatibleTx.md#r)

#### Defined in

[tx/src/types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[s](EIP2930CompatibleTx.md#s)

#### Defined in

[tx/src/types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L149)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[to](EIP2930CompatibleTx.md#to)

#### Defined in

[tx/src/types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L144)

___

### type

• **type**: [`TransactionType`](../enums/TransactionType.md)

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[type](EIP2930CompatibleTx.md#type)

#### Defined in

[tx/src/types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[v](EIP2930CompatibleTx.md#v)

#### Defined in

[tx/src/types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[value](EIP2930CompatibleTx.md#value)

#### Defined in

[tx/src/types.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L145)

## Methods

### errorStr

▸ **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[errorStr](EIP2930CompatibleTx.md#errorstr)

#### Defined in

[tx/src/types.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L171)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getBaseFee](EIP2930CompatibleTx.md#getbasefee)

#### Defined in

[tx/src/types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### getDataFee

▸ **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getDataFee](EIP2930CompatibleTx.md#getdatafee)

#### Defined in

[tx/src/types.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L154)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getHashedMessageToSign](EIP2930CompatibleTx.md#gethashedmessagetosign)

#### Defined in

[tx/src/types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L160)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getMessageToSign](EIP2930CompatibleTx.md#getmessagetosign)

#### Defined in

[tx/src/types.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L180)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getMessageToVerifySignature](EIP2930CompatibleTx.md#getmessagetoverifysignature)

#### Defined in

[tx/src/types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L162)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getSenderAddress](EIP2930CompatibleTx.md#getsenderaddress)

#### Defined in

[tx/src/types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L167)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getSenderPublicKey](EIP2930CompatibleTx.md#getsenderpublickey)

#### Defined in

[tx/src/types.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L168)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getUpfrontCost](EIP2930CompatibleTx.md#getupfrontcost)

#### Defined in

[tx/src/types.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L155)

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[getValidationErrors](EIP2930CompatibleTx.md#getvalidationerrors)

#### Defined in

[tx/src/types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[hash](EIP2930CompatibleTx.md#hash)

#### Defined in

[tx/src/types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L161)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[isSigned](EIP2930CompatibleTx.md#issigned)

#### Defined in

[tx/src/types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)

___

### isValid

▸ **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[isValid](EIP2930CompatibleTx.md#isvalid)

#### Defined in

[tx/src/types.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L165)

___

### raw

▸ **raw**(): [`TxValuesArray`](TxValuesArray.md)[`T`]

#### Returns

[`TxValuesArray`](TxValuesArray.md)[`T`]

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[raw](EIP2930CompatibleTx.md#raw)

#### Defined in

[tx/src/types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L157)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[serialize](EIP2930CompatibleTx.md#serialize)

#### Defined in

[tx/src/types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L158)

___

### sign

▸ **sign**(`privateKey`): [`Transaction`](Transaction.md)[`T`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |

#### Returns

[`Transaction`](Transaction.md)[`T`]

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[sign](EIP2930CompatibleTx.md#sign)

#### Defined in

[tx/src/types.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L169)

___

### supports

▸ **supports**(`capability`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `capability` | [`Capability`](../enums/Capability.md) |

#### Returns

`boolean`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[supports](EIP2930CompatibleTx.md#supports)

#### Defined in

[tx/src/types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L151)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[toCreationAddress](EIP2930CompatibleTx.md#tocreationaddress)

#### Defined in

[tx/src/types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L156)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[toJSON](EIP2930CompatibleTx.md#tojson)

#### Defined in

[tx/src/types.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L170)

___

### verifySignature

▸ **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2930CompatibleTx](EIP2930CompatibleTx.md).[verifySignature](EIP2930CompatibleTx.md#verifysignature)

#### Defined in

[tx/src/types.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L166)
