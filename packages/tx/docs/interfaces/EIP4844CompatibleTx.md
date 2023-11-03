[@ethereumjs/tx](../README.md) / EIP4844CompatibleTx

# Interface: EIP4844CompatibleTx<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TransactionType`](../enums/TransactionType.md) = [`TransactionType`](../enums/TransactionType.md) |

## Hierarchy

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)<`T`\>

  ↳ **`EIP4844CompatibleTx`**

## Table of contents

### Properties

- [AccessListJSON](EIP4844CompatibleTx.md#accesslistjson)
- [accessList](EIP4844CompatibleTx.md#accesslist)
- [blobVersionedHashes](EIP4844CompatibleTx.md#blobversionedhashes)
- [blobs](EIP4844CompatibleTx.md#blobs)
- [cache](EIP4844CompatibleTx.md#cache)
- [chainId](EIP4844CompatibleTx.md#chainid)
- [common](EIP4844CompatibleTx.md#common)
- [data](EIP4844CompatibleTx.md#data)
- [gasLimit](EIP4844CompatibleTx.md#gaslimit)
- [kzgCommitments](EIP4844CompatibleTx.md#kzgcommitments)
- [kzgProofs](EIP4844CompatibleTx.md#kzgproofs)
- [maxFeePerBlobGas](EIP4844CompatibleTx.md#maxfeeperblobgas)
- [maxFeePerGas](EIP4844CompatibleTx.md#maxfeepergas)
- [maxPriorityFeePerGas](EIP4844CompatibleTx.md#maxpriorityfeepergas)
- [nonce](EIP4844CompatibleTx.md#nonce)
- [r](EIP4844CompatibleTx.md#r)
- [s](EIP4844CompatibleTx.md#s)
- [to](EIP4844CompatibleTx.md#to)
- [type](EIP4844CompatibleTx.md#type)
- [v](EIP4844CompatibleTx.md#v)
- [value](EIP4844CompatibleTx.md#value)

### Methods

- [errorStr](EIP4844CompatibleTx.md#errorstr)
- [getBaseFee](EIP4844CompatibleTx.md#getbasefee)
- [getDataFee](EIP4844CompatibleTx.md#getdatafee)
- [getHashedMessageToSign](EIP4844CompatibleTx.md#gethashedmessagetosign)
- [getMessageToSign](EIP4844CompatibleTx.md#getmessagetosign)
- [getMessageToVerifySignature](EIP4844CompatibleTx.md#getmessagetoverifysignature)
- [getSenderAddress](EIP4844CompatibleTx.md#getsenderaddress)
- [getSenderPublicKey](EIP4844CompatibleTx.md#getsenderpublickey)
- [getUpfrontCost](EIP4844CompatibleTx.md#getupfrontcost)
- [getValidationErrors](EIP4844CompatibleTx.md#getvalidationerrors)
- [hash](EIP4844CompatibleTx.md#hash)
- [isSigned](EIP4844CompatibleTx.md#issigned)
- [isValid](EIP4844CompatibleTx.md#isvalid)
- [numBlobs](EIP4844CompatibleTx.md#numblobs)
- [raw](EIP4844CompatibleTx.md#raw)
- [serialize](EIP4844CompatibleTx.md#serialize)
- [serializeNetworkWrapper](EIP4844CompatibleTx.md#serializenetworkwrapper)
- [sign](EIP4844CompatibleTx.md#sign)
- [supports](EIP4844CompatibleTx.md#supports)
- [toCreationAddress](EIP4844CompatibleTx.md#tocreationaddress)
- [toJSON](EIP4844CompatibleTx.md#tojson)
- [verifySignature](EIP4844CompatibleTx.md#verifysignature)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [`AccessList`](../README.md#accesslist)

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[AccessListJSON](EIP1559CompatibleTx.md#accesslistjson)

#### Defined in

[tx/src/types.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L186)

___

### accessList

• `Readonly` **accessList**: [`AccessListBytes`](../README.md#accesslistbytes)

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[accessList](EIP1559CompatibleTx.md#accesslist)

#### Defined in

[tx/src/types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L185)

___

### blobVersionedHashes

• **blobVersionedHashes**: `Uint8Array`[]

#### Defined in

[tx/src/types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

___

### blobs

• `Optional` **blobs**: `Uint8Array`[]

#### Defined in

[tx/src/types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

___

### cache

• `Readonly` **cache**: [`TransactionCache`](TransactionCache.md)

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[cache](EIP1559CompatibleTx.md#cache)

#### Defined in

[tx/src/types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L150)

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[chainId](EIP1559CompatibleTx.md#chainid)

#### Defined in

[tx/src/types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[common](EIP1559CompatibleTx.md#common)

#### Defined in

[tx/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L141)

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[data](EIP1559CompatibleTx.md#data)

#### Defined in

[tx/src/types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L146)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[gasLimit](EIP1559CompatibleTx.md#gaslimit)

#### Defined in

[tx/src/types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### kzgCommitments

• `Optional` **kzgCommitments**: `Uint8Array`[]

#### Defined in

[tx/src/types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L200)

___

### kzgProofs

• `Optional` **kzgProofs**: `Uint8Array`[]

#### Defined in

[tx/src/types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

___

### maxFeePerBlobGas

• `Readonly` **maxFeePerBlobGas**: `bigint`

#### Defined in

[tx/src/types.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

___

### maxFeePerGas

• `Readonly` **maxFeePerGas**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[maxFeePerGas](EIP1559CompatibleTx.md#maxfeepergas)

#### Defined in

[tx/src/types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L192)

___

### maxPriorityFeePerGas

• `Readonly` **maxPriorityFeePerGas**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[maxPriorityFeePerGas](EIP1559CompatibleTx.md#maxpriorityfeepergas)

#### Defined in

[tx/src/types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[nonce](EIP1559CompatibleTx.md#nonce)

#### Defined in

[tx/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[r](EIP1559CompatibleTx.md#r)

#### Defined in

[tx/src/types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[s](EIP1559CompatibleTx.md#s)

#### Defined in

[tx/src/types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L149)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[to](EIP1559CompatibleTx.md#to)

#### Defined in

[tx/src/types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L144)

___

### type

• **type**: [`TransactionType`](../enums/TransactionType.md)

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[type](EIP1559CompatibleTx.md#type)

#### Defined in

[tx/src/types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[v](EIP1559CompatibleTx.md#v)

#### Defined in

[tx/src/types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[value](EIP1559CompatibleTx.md#value)

#### Defined in

[tx/src/types.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L145)

## Methods

### errorStr

▸ **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[errorStr](EIP1559CompatibleTx.md#errorstr)

#### Defined in

[tx/src/types.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L171)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getBaseFee](EIP1559CompatibleTx.md#getbasefee)

#### Defined in

[tx/src/types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### getDataFee

▸ **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getDataFee](EIP1559CompatibleTx.md#getdatafee)

#### Defined in

[tx/src/types.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L154)

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getHashedMessageToSign](EIP1559CompatibleTx.md#gethashedmessagetosign)

#### Defined in

[tx/src/types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L160)

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getMessageToSign](EIP1559CompatibleTx.md#getmessagetosign)

#### Defined in

[tx/src/types.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L180)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getMessageToVerifySignature](EIP1559CompatibleTx.md#getmessagetoverifysignature)

#### Defined in

[tx/src/types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L162)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getSenderAddress](EIP1559CompatibleTx.md#getsenderaddress)

#### Defined in

[tx/src/types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L167)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getSenderPublicKey](EIP1559CompatibleTx.md#getsenderpublickey)

#### Defined in

[tx/src/types.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L168)

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getUpfrontCost](EIP1559CompatibleTx.md#getupfrontcost)

#### Defined in

[tx/src/types.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L155)

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[getValidationErrors](EIP1559CompatibleTx.md#getvalidationerrors)

#### Defined in

[tx/src/types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[hash](EIP1559CompatibleTx.md#hash)

#### Defined in

[tx/src/types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L161)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[isSigned](EIP1559CompatibleTx.md#issigned)

#### Defined in

[tx/src/types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)

___

### isValid

▸ **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[isValid](EIP1559CompatibleTx.md#isvalid)

#### Defined in

[tx/src/types.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L165)

___

### numBlobs

▸ **numBlobs**(): `number`

#### Returns

`number`

#### Defined in

[tx/src/types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

___

### raw

▸ **raw**(): [`TxValuesArray`](TxValuesArray.md)[`T`]

#### Returns

[`TxValuesArray`](TxValuesArray.md)[`T`]

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[raw](EIP1559CompatibleTx.md#raw)

#### Defined in

[tx/src/types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L157)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[serialize](EIP1559CompatibleTx.md#serialize)

#### Defined in

[tx/src/types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L158)

___

### serializeNetworkWrapper

▸ **serializeNetworkWrapper**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[tx/src/types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L202)

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

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[sign](EIP1559CompatibleTx.md#sign)

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

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[supports](EIP1559CompatibleTx.md#supports)

#### Defined in

[tx/src/types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L151)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[toCreationAddress](EIP1559CompatibleTx.md#tocreationaddress)

#### Defined in

[tx/src/types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L156)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[toJSON](EIP1559CompatibleTx.md#tojson)

#### Defined in

[tx/src/types.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L170)

___

### verifySignature

▸ **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EIP1559CompatibleTx](EIP1559CompatibleTx.md).[verifySignature](EIP1559CompatibleTx.md#verifysignature)

#### Defined in

[tx/src/types.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L166)
