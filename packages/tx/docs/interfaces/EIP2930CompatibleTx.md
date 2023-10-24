[@ethereumjs/tx](../README.md) / EIP2930CompatibleTx

# Interface: EIP2930CompatibleTx<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) = [`TransactionType`](../enums/TransactionType.md) |

## Hierarchy

- [`EIP2718CompatibleTx`](EIP2718CompatibleTx.md)<`T`\>

  ↳ **`EIP2930CompatibleTx`**

  ↳↳ [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)

## Table of contents

### Properties

- [AccessListJSON](EIP2930CompatibleTx.md#accesslistjson)
- [accessList](EIP2930CompatibleTx.md#accesslist)
- [cache](EIP2930CompatibleTx.md#cache)
- [chainId](EIP2930CompatibleTx.md#chainid)
- [common](EIP2930CompatibleTx.md#common)
- [data](EIP2930CompatibleTx.md#data)
- [gasLimit](EIP2930CompatibleTx.md#gaslimit)
- [nonce](EIP2930CompatibleTx.md#nonce)
- [r](EIP2930CompatibleTx.md#r)
- [s](EIP2930CompatibleTx.md#s)
- [to](EIP2930CompatibleTx.md#to)
- [type](EIP2930CompatibleTx.md#type)
- [v](EIP2930CompatibleTx.md#v)
- [value](EIP2930CompatibleTx.md#value)

### Methods

- [errorStr](EIP2930CompatibleTx.md#errorstr)
- [getBaseFee](EIP2930CompatibleTx.md#getbasefee)
- [getDataFee](EIP2930CompatibleTx.md#getdatafee)
- [getHashedMessageToSign](EIP2930CompatibleTx.md#gethashedmessagetosign)
- [getMessageToSign](EIP2930CompatibleTx.md#getmessagetosign)
- [getMessageToVerifySignature](EIP2930CompatibleTx.md#getmessagetoverifysignature)
- [getSenderAddress](EIP2930CompatibleTx.md#getsenderaddress)
- [getSenderPublicKey](EIP2930CompatibleTx.md#getsenderpublickey)
- [getUpfrontCost](EIP2930CompatibleTx.md#getupfrontcost)
- [getValidationErrors](EIP2930CompatibleTx.md#getvalidationerrors)
- [hash](EIP2930CompatibleTx.md#hash)
- [isSigned](EIP2930CompatibleTx.md#issigned)
- [isValid](EIP2930CompatibleTx.md#isvalid)
- [raw](EIP2930CompatibleTx.md#raw)
- [serialize](EIP2930CompatibleTx.md#serialize)
- [sign](EIP2930CompatibleTx.md#sign)
- [supports](EIP2930CompatibleTx.md#supports)
- [toCreationAddress](EIP2930CompatibleTx.md#tocreationaddress)
- [toJSON](EIP2930CompatibleTx.md#tojson)
- [verifySignature](EIP2930CompatibleTx.md#verifysignature)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [`AccessList`](../README.md#accesslist)

#### Defined in

[tx/src/types.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L186)

___

### accessList

• `Readonly` **accessList**: [`AccessListBytes`](../README.md#accesslistbytes)

#### Defined in

[tx/src/types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L185)

___

### cache

• `Readonly` **cache**: [`TransactionCache`](TransactionCache.md)

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[cache](EIP2718CompatibleTx.md#cache)

#### Defined in

[tx/src/types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L150)

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[chainId](EIP2718CompatibleTx.md#chainid)

#### Defined in

[tx/src/types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[common](EIP2718CompatibleTx.md#common)

#### Defined in

[tx/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L141)

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[data](EIP2718CompatibleTx.md#data)

#### Defined in

[tx/src/types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L146)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[gasLimit](EIP2718CompatibleTx.md#gaslimit)

#### Defined in

[tx/src/types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[nonce](EIP2718CompatibleTx.md#nonce)

#### Defined in

[tx/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[r](EIP2718CompatibleTx.md#r)

#### Defined in

[tx/src/types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[s](EIP2718CompatibleTx.md#s)

#### Defined in

[tx/src/types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L149)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[to](EIP2718CompatibleTx.md#to)

#### Defined in

[tx/src/types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L144)

___

### type

• **type**: [`TransactionType`](../enums/TransactionType.md)

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[type](EIP2718CompatibleTx.md#type)

#### Defined in

[tx/src/types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[v](EIP2718CompatibleTx.md#v)

#### Defined in

[tx/src/types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[value](EIP2718CompatibleTx.md#value)

#### Defined in

[tx/src/types.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L145)

## Methods

### errorStr

▸ **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[errorStr](EIP2718CompatibleTx.md#errorstr)

#### Defined in

[tx/src/types.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L171)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getBaseFee](EIP2718CompatibleTx.md#getbasefee)

#### Defined in

[tx/src/types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### getDataFee

▸ **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getDataFee](EIP2718CompatibleTx.md#getdatafee)

#### Defined in

[tx/src/types.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L154)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getHashedMessageToSign](EIP2718CompatibleTx.md#gethashedmessagetosign)

#### Defined in

[tx/src/types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L160)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getMessageToSign](EIP2718CompatibleTx.md#getmessagetosign)

#### Defined in

[tx/src/types.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L180)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getMessageToVerifySignature](EIP2718CompatibleTx.md#getmessagetoverifysignature)

#### Defined in

[tx/src/types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L162)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getSenderAddress](EIP2718CompatibleTx.md#getsenderaddress)

#### Defined in

[tx/src/types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L167)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getSenderPublicKey](EIP2718CompatibleTx.md#getsenderpublickey)

#### Defined in

[tx/src/types.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L168)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getUpfrontCost](EIP2718CompatibleTx.md#getupfrontcost)

#### Defined in

[tx/src/types.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L155)

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[getValidationErrors](EIP2718CompatibleTx.md#getvalidationerrors)

#### Defined in

[tx/src/types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[hash](EIP2718CompatibleTx.md#hash)

#### Defined in

[tx/src/types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L161)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[isSigned](EIP2718CompatibleTx.md#issigned)

#### Defined in

[tx/src/types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)

___

### isValid

▸ **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[isValid](EIP2718CompatibleTx.md#isvalid)

#### Defined in

[tx/src/types.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L165)

___

### raw

▸ **raw**(): [`TxValuesArray`](TxValuesArray.md)[`T`]

#### Returns

[`TxValuesArray`](TxValuesArray.md)[`T`]

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[raw](EIP2718CompatibleTx.md#raw)

#### Defined in

[tx/src/types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L157)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[serialize](EIP2718CompatibleTx.md#serialize)

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

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[sign](EIP2718CompatibleTx.md#sign)

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

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[supports](EIP2718CompatibleTx.md#supports)

#### Defined in

[tx/src/types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L151)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[toCreationAddress](EIP2718CompatibleTx.md#tocreationaddress)

#### Defined in

[tx/src/types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L156)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[toJSON](EIP2718CompatibleTx.md#tojson)

#### Defined in

[tx/src/types.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L170)

___

### verifySignature

▸ **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP2718CompatibleTx](EIP2718CompatibleTx.md).[verifySignature](EIP2718CompatibleTx.md#verifysignature)

#### Defined in

[tx/src/types.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L166)
