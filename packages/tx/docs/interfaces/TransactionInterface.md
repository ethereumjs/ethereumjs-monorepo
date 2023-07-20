[@ethereumjs/tx](../README.md) / TransactionInterface

# Interface: TransactionInterface<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) |

## Table of contents

### Properties

- [type](TransactionInterface.md#type)

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

### type

• **type**: `number`

#### Defined in

[tx/src/types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L133)

## Methods

### errorStr

▸ **errorStr**(): `string`

#### Returns

`string`

#### Defined in

[tx/src/types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Defined in

[tx/src/types.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L134)

___

### getDataFee

▸ **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Defined in

[tx/src/types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L135)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L141)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array` \| `Uint8Array`[]

#### Returns

`Uint8Array` \| `Uint8Array`[]

#### Defined in

[tx/src/types.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L140)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Defined in

[tx/src/types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L149)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Defined in

[tx/src/types.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L136)

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Defined in

[tx/src/types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L144)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L145)

___

### isValid

▸ **isValid**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L146)

___

### raw

▸ **raw**(): [`TxValuesArray`](TxValuesArray.md)[`T`]

#### Returns

[`TxValuesArray`](TxValuesArray.md)[`T`]

#### Defined in

[tx/src/types.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L138)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L139)

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

[tx/src/types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L150)

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

[tx/src/types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L132)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L137)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Defined in

[tx/src/types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L151)

___

### verifySignature

▸ **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Defined in

[tx/src/types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)
