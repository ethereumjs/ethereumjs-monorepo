[@ethereumjs/tx](../README.md) / TransactionInterface

# Interface: TransactionInterface<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) = [`TransactionType`](../enums/TransactionType.md) |

## Hierarchy

- **`TransactionInterface`**

  ↳ [`LegacyTxInterface`](LegacyTxInterface.md)

  ↳ [`EIP2718CompatibleTx`](EIP2718CompatibleTx.md)

## Table of contents

### Properties

- [cache](TransactionInterface.md#cache)
- [common](TransactionInterface.md#common)
- [data](TransactionInterface.md#data)
- [gasLimit](TransactionInterface.md#gaslimit)
- [nonce](TransactionInterface.md#nonce)
- [r](TransactionInterface.md#r)
- [s](TransactionInterface.md#s)
- [to](TransactionInterface.md#to)
- [type](TransactionInterface.md#type)
- [v](TransactionInterface.md#v)
- [value](TransactionInterface.md#value)

### Methods

- [errorStr](TransactionInterface.md#errorstr)
- [getBaseFee](TransactionInterface.md#getbasefee)
- [getDataFee](TransactionInterface.md#getdatafee)
- [getHashedMessageToSign](TransactionInterface.md#gethashedmessagetosign)
- [getMessageToSign](TransactionInterface.md#getmessagetosign)
- [getMessageToVerifySignature](TransactionInterface.md#getmessagetoverifysignature)
- [getSenderAddress](TransactionInterface.md#getsenderaddress)
- [getSenderPublicKey](TransactionInterface.md#getsenderpublickey)
- [getUpfrontCost](TransactionInterface.md#getupfrontcost)
- [getValidationErrors](TransactionInterface.md#getvalidationerrors)
- [hash](TransactionInterface.md#hash)
- [isSigned](TransactionInterface.md#issigned)
- [isValid](TransactionInterface.md#isvalid)
- [raw](TransactionInterface.md#raw)
- [serialize](TransactionInterface.md#serialize)
- [sign](TransactionInterface.md#sign)
- [supports](TransactionInterface.md#supports)
- [toCreationAddress](TransactionInterface.md#tocreationaddress)
- [toJSON](TransactionInterface.md#tojson)
- [verifySignature](TransactionInterface.md#verifysignature)

## Properties

### cache

• `Readonly` **cache**: [`TransactionCache`](TransactionCache.md)

#### Defined in

[tx/src/types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L150)

___

### common

• `Readonly` **common**: `Common`

#### Defined in

[tx/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L141)

___

### data

• `Readonly` **data**: `Uint8Array`

#### Defined in

[tx/src/types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L146)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Defined in

[tx/src/types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Defined in

[tx/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Defined in

[tx/src/types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Defined in

[tx/src/types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L149)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Defined in

[tx/src/types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L144)

___

### type

• **type**: [`TransactionType`](../enums/TransactionType.md)

#### Defined in

[tx/src/types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Defined in

[tx/src/types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### value

• `Readonly` **value**: `bigint`

#### Defined in

[tx/src/types.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L145)

## Methods

### errorStr

▸ **errorStr**(): `string`

#### Returns

`string`

#### Defined in

[tx/src/types.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L171)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Defined in

[tx/src/types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### getDataFee

▸ **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Defined in

[tx/src/types.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L154)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L160)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array` \| `Uint8Array`[]

#### Returns

`Uint8Array` \| `Uint8Array`[]

#### Defined in

[tx/src/types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L159)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L162)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Defined in

[tx/src/types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L167)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L168)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Defined in

[tx/src/types.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L155)

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Defined in

[tx/src/types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L161)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)

___

### isValid

▸ **isValid**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L165)

___

### raw

▸ **raw**(): [`TxValuesArray`](TxValuesArray.md)[`T`]

#### Returns

[`TxValuesArray`](TxValuesArray.md)[`T`]

#### Defined in

[tx/src/types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L157)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

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

#### Defined in

[tx/src/types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L151)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L156)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Defined in

[tx/src/types.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L170)

___

### verifySignature

▸ **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L166)
