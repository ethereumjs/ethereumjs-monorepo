[@ethereumjs/tx](../README.md) / LegacyTxInterface

# Interface: LegacyTxInterface<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) = [`TransactionType`](../enums/TransactionType.md) |

## Hierarchy

- [`TransactionInterface`](TransactionInterface.md)<`T`\>

  ↳ **`LegacyTxInterface`**

## Table of contents

### Properties

- [cache](LegacyTxInterface.md#cache)
- [common](LegacyTxInterface.md#common)
- [data](LegacyTxInterface.md#data)
- [gasLimit](LegacyTxInterface.md#gaslimit)
- [nonce](LegacyTxInterface.md#nonce)
- [r](LegacyTxInterface.md#r)
- [s](LegacyTxInterface.md#s)
- [to](LegacyTxInterface.md#to)
- [type](LegacyTxInterface.md#type)
- [v](LegacyTxInterface.md#v)
- [value](LegacyTxInterface.md#value)

### Methods

- [errorStr](LegacyTxInterface.md#errorstr)
- [getBaseFee](LegacyTxInterface.md#getbasefee)
- [getDataFee](LegacyTxInterface.md#getdatafee)
- [getHashedMessageToSign](LegacyTxInterface.md#gethashedmessagetosign)
- [getMessageToSign](LegacyTxInterface.md#getmessagetosign)
- [getMessageToVerifySignature](LegacyTxInterface.md#getmessagetoverifysignature)
- [getSenderAddress](LegacyTxInterface.md#getsenderaddress)
- [getSenderPublicKey](LegacyTxInterface.md#getsenderpublickey)
- [getUpfrontCost](LegacyTxInterface.md#getupfrontcost)
- [getValidationErrors](LegacyTxInterface.md#getvalidationerrors)
- [hash](LegacyTxInterface.md#hash)
- [isSigned](LegacyTxInterface.md#issigned)
- [isValid](LegacyTxInterface.md#isvalid)
- [raw](LegacyTxInterface.md#raw)
- [serialize](LegacyTxInterface.md#serialize)
- [sign](LegacyTxInterface.md#sign)
- [supports](LegacyTxInterface.md#supports)
- [toCreationAddress](LegacyTxInterface.md#tocreationaddress)
- [toJSON](LegacyTxInterface.md#tojson)
- [verifySignature](LegacyTxInterface.md#verifysignature)

## Properties

### cache

• `Readonly` **cache**: [`TransactionCache`](TransactionCache.md)

#### Inherited from

[TransactionInterface](TransactionInterface.md).[cache](TransactionInterface.md#cache)

#### Defined in

[tx/src/types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L150)

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[common](TransactionInterface.md#common)

#### Defined in

[tx/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L141)

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[data](TransactionInterface.md#data)

#### Defined in

[tx/src/types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L146)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[gasLimit](TransactionInterface.md#gaslimit)

#### Defined in

[tx/src/types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[nonce](TransactionInterface.md#nonce)

#### Defined in

[tx/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[r](TransactionInterface.md#r)

#### Defined in

[tx/src/types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[s](TransactionInterface.md#s)

#### Defined in

[tx/src/types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L149)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[to](TransactionInterface.md#to)

#### Defined in

[tx/src/types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L144)

___

### type

• **type**: [`TransactionType`](../enums/TransactionType.md)

#### Inherited from

[TransactionInterface](TransactionInterface.md).[type](TransactionInterface.md#type)

#### Defined in

[tx/src/types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[v](TransactionInterface.md#v)

#### Defined in

[tx/src/types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[value](TransactionInterface.md#value)

#### Defined in

[tx/src/types.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L145)

## Methods

### errorStr

▸ **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[errorStr](TransactionInterface.md#errorstr)

#### Defined in

[tx/src/types.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L171)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getBaseFee](TransactionInterface.md#getbasefee)

#### Defined in

[tx/src/types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### getDataFee

▸ **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getDataFee](TransactionInterface.md#getdatafee)

#### Defined in

[tx/src/types.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L154)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getHashedMessageToSign](TransactionInterface.md#gethashedmessagetosign)

#### Defined in

[tx/src/types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L160)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array` \| `Uint8Array`[]

#### Returns

`Uint8Array` \| `Uint8Array`[]

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getMessageToSign](TransactionInterface.md#getmessagetosign)

#### Defined in

[tx/src/types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L159)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getMessageToVerifySignature](TransactionInterface.md#getmessagetoverifysignature)

#### Defined in

[tx/src/types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L162)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getSenderAddress](TransactionInterface.md#getsenderaddress)

#### Defined in

[tx/src/types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L167)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getSenderPublicKey](TransactionInterface.md#getsenderpublickey)

#### Defined in

[tx/src/types.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L168)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getUpfrontCost](TransactionInterface.md#getupfrontcost)

#### Defined in

[tx/src/types.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L155)

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[TransactionInterface](TransactionInterface.md).[getValidationErrors](TransactionInterface.md#getvalidationerrors)

#### Defined in

[tx/src/types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[hash](TransactionInterface.md#hash)

#### Defined in

[tx/src/types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L161)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[isSigned](TransactionInterface.md#issigned)

#### Defined in

[tx/src/types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)

___

### isValid

▸ **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[isValid](TransactionInterface.md#isvalid)

#### Defined in

[tx/src/types.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L165)

___

### raw

▸ **raw**(): [`TxValuesArray`](TxValuesArray.md)[`T`]

#### Returns

[`TxValuesArray`](TxValuesArray.md)[`T`]

#### Inherited from

[TransactionInterface](TransactionInterface.md).[raw](TransactionInterface.md#raw)

#### Defined in

[tx/src/types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L157)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[serialize](TransactionInterface.md#serialize)

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

[TransactionInterface](TransactionInterface.md).[sign](TransactionInterface.md#sign)

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

[TransactionInterface](TransactionInterface.md).[supports](TransactionInterface.md#supports)

#### Defined in

[tx/src/types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L151)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[toCreationAddress](TransactionInterface.md#tocreationaddress)

#### Defined in

[tx/src/types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L156)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[TransactionInterface](TransactionInterface.md).[toJSON](TransactionInterface.md#tojson)

#### Defined in

[tx/src/types.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L170)

___

### verifySignature

▸ **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[TransactionInterface](TransactionInterface.md).[verifySignature](TransactionInterface.md#verifysignature)

#### Defined in

[tx/src/types.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L166)
