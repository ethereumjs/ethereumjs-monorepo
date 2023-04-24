@ethereumjs/tx

# @ethereumjs/tx

## Table of contents

### Enumerations

- [Capability](enums/Capability.md)

### Classes

- [AccessListEIP2930Transaction](classes/AccessListEIP2930Transaction.md)
- [BlobEIP4844Transaction](classes/BlobEIP4844Transaction.md)
- [FeeMarketEIP1559Transaction](classes/FeeMarketEIP1559Transaction.md)
- [Transaction](classes/Transaction.md)
- [TransactionFactory](classes/TransactionFactory.md)

### Interfaces

- [AccessListEIP2930TxData](interfaces/AccessListEIP2930TxData.md)
- [BlobEIP4844TxData](interfaces/BlobEIP4844TxData.md)
- [FeeMarketEIP1559TxData](interfaces/FeeMarketEIP1559TxData.md)
- [JsonRpcTx](interfaces/JsonRpcTx.md)
- [JsonTx](interfaces/JsonTx.md)
- [TxOptions](interfaces/TxOptions.md)

### Type Aliases

- [AccessList](README.md#accesslist)
- [AccessListBuffer](README.md#accesslistbuffer)
- [AccessListBufferItem](README.md#accesslistbufferitem)
- [AccessListEIP2930ValuesArray](README.md#accesslisteip2930valuesarray)
- [AccessListItem](README.md#accesslistitem)
- [FeeMarketEIP1559ValuesArray](README.md#feemarketeip1559valuesarray)
- [TxData](README.md#txdata)
- [TxValuesArray](README.md#txvaluesarray)
- [TypedTransaction](README.md#typedtransaction)

### Variables

- [AccessTupleType](README.md#accesstupletype)
- [AddressType](README.md#addresstype)
- [BlobNetworkTransactionWrapper](README.md#blobnetworktransactionwrapper)
- [BlobTransactionType](README.md#blobtransactiontype)
- [ECDSASignatureType](README.md#ecdsasignaturetype)
- [KZGCommitmentType](README.md#kzgcommitmenttype)
- [KZGProofType](README.md#kzgprooftype)
- [SignedBlobTransactionType](README.md#signedblobtransactiontype)
- [kzg](README.md#kzg)

### Functions

- [computeVersionedHash](README.md#computeversionedhash)
- [initKZG](README.md#initkzg)
- [isAccessList](README.md#isaccesslist)
- [isAccessListBuffer](README.md#isaccesslistbuffer)

## Type Aliases

### AccessList

Ƭ **AccessList**: [`AccessListItem`](README.md#accesslistitem)[]

#### Defined in

[types.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L115)

___

### AccessListBuffer

Ƭ **AccessListBuffer**: [`AccessListBufferItem`](README.md#accesslistbufferitem)[]

#### Defined in

[types.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L114)

___

### AccessListBufferItem

Ƭ **AccessListBufferItem**: [`Buffer`, `Buffer`[]]

#### Defined in

[types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L113)

___

### AccessListEIP2930ValuesArray

Ƭ **AccessListEIP2930ValuesArray**: [`Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, [`AccessListBuffer`](README.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for an [AccessListEIP2930Transaction](classes/AccessListEIP2930Transaction.md)

#### Defined in

[types.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L270)

___

### AccessListItem

Ƭ **AccessListItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `PrefixedHexString` |
| `storageKeys` | `PrefixedHexString`[] |

#### Defined in

[types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L105)

___

### FeeMarketEIP1559ValuesArray

Ƭ **FeeMarketEIP1559ValuesArray**: [`Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, [`AccessListBuffer`](README.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for a [FeeMarketEIP1559Transaction](classes/FeeMarketEIP1559Transaction.md)

#### Defined in

[types.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L287)

___

### TxData

Ƭ **TxData**: `Object`

Legacy [Transaction](classes/Transaction.md) Data

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `BufferLike` | This will contain the data of the message or the init of a contract. |
| `gasLimit?` | `BigIntLike` | The transaction's gas limit. |
| `gasPrice?` | `BigIntLike` \| ``null`` | The transaction's gas price. |
| `nonce?` | `BigIntLike` | The transaction's nonce. |
| `r?` | `BigIntLike` | EC signature parameter. |
| `s?` | `BigIntLike` | EC signature parameter. |
| `to?` | `AddressLike` | The transaction's the address is sent to. |
| `type?` | `BigIntLike` | The transaction type |
| `v?` | `BigIntLike` | EC recovery ID. |
| `value?` | `BigIntLike` | The amount of Ether sent. |

#### Defined in

[types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L149)

___

### TxValuesArray

Ƭ **TxValuesArray**: `Buffer`[]

Buffer values array for a legacy [Transaction](classes/Transaction.md)

#### Defined in

[types.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L265)

___

### TypedTransaction

Ƭ **TypedTransaction**: [`Transaction`](classes/Transaction.md) \| [`AccessListEIP2930Transaction`](classes/AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](classes/FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](classes/BlobEIP4844Transaction.md)

Encompassing type for all transaction types.

Note that this also includes legacy txs which are
referenced as [Transaction](classes/Transaction.md) for compatibility reasons.

#### Defined in

[types.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L140)

## Variables

### AccessTupleType

• `Const` **AccessTupleType**: `ContainerType`<{ `address`: `ByteVectorType` = AddressType; `storageKeys`: `ListCompositeType`<`ByteVectorType`\>  }\>

#### Defined in

[types.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L362)

___

### AddressType

• `Const` **AddressType**: `ByteVectorType` = `Bytes20`

EIP4844 types

#### Defined in

[types.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L359)

___

### BlobNetworkTransactionWrapper

• `Const` **BlobNetworkTransactionWrapper**: `ContainerType`<{ `blobKzgs`: `ListCompositeType`<`ByteVectorType`\> ; `blobs`: `ListCompositeType`<`ByteVectorType`\> ; `kzgAggregatedProof`: `ByteVectorType` = KZGProofType; `tx`: `ContainerType`<{ `message`: `ContainerType`<{ `accessList`: `ListCompositeType`<`ContainerType`<{ `address`: `ByteVectorType` = AddressType; `storageKeys`: `ListCompositeType`<`ByteVectorType`\>  }\>\> ; `blobVersionedHashes`: `ListCompositeType`<`ByteVectorType`\> ; `chainId`: `UintBigintType` = Uint256; `data`: `ByteListType` ; `gas`: `UintBigintType` = Uint64; `maxFeePerDataGas`: `UintBigintType` = Uint256; `maxFeePerGas`: `UintBigintType` = Uint256; `maxPriorityFeePerGas`: `UintBigintType` = Uint256; `nonce`: `UintBigintType` = Uint64; `to`: `UnionType`<(`ByteVectorType` \| `NoneType`)[]\> ; `value`: `UintBigintType` = Uint256 }\> = BlobTransactionType; `signature`: `ContainerType`<{ `r`: `UintBigintType` = Uint256; `s`: `UintBigintType` = Uint256; `yParity`: `BooleanType`  }\> = ECDSASignatureType }\> = SignedBlobTransactionType }\>

#### Defined in

[types.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L400)

___

### BlobTransactionType

• `Const` **BlobTransactionType**: `ContainerType`<{ `accessList`: `ListCompositeType`<`ContainerType`<{ `address`: `ByteVectorType` = AddressType; `storageKeys`: `ListCompositeType`<`ByteVectorType`\>  }\>\> ; `blobVersionedHashes`: `ListCompositeType`<`ByteVectorType`\> ; `chainId`: `UintBigintType` = Uint256; `data`: `ByteListType` ; `gas`: `UintBigintType` = Uint64; `maxFeePerDataGas`: `UintBigintType` = Uint256; `maxFeePerGas`: `UintBigintType` = Uint256; `maxPriorityFeePerGas`: `UintBigintType` = Uint256; `nonce`: `UintBigintType` = Uint64; `to`: `UnionType`<(`ByteVectorType` \| `NoneType`)[]\> ; `value`: `UintBigintType` = Uint256 }\>

#### Defined in

[types.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L368)

___

### ECDSASignatureType

• `Const` **ECDSASignatureType**: `ContainerType`<{ `r`: `UintBigintType` = Uint256; `s`: `UintBigintType` = Uint256; `yParity`: `BooleanType`  }\>

#### Defined in

[types.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L383)

___

### KZGCommitmentType

• `Const` **KZGCommitmentType**: `ByteVectorType` = `Bytes48`

#### Defined in

[types.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L396)

___

### KZGProofType

• `Const` **KZGProofType**: `ByteVectorType` = `KZGCommitmentType`

#### Defined in

[types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

___

### SignedBlobTransactionType

• `Const` **SignedBlobTransactionType**: `ContainerType`<{ `message`: `ContainerType`<{ `accessList`: `ListCompositeType`<`ContainerType`<{ `address`: `ByteVectorType` = AddressType; `storageKeys`: `ListCompositeType`<`ByteVectorType`\>  }\>\> ; `blobVersionedHashes`: `ListCompositeType`<`ByteVectorType`\> ; `chainId`: `UintBigintType` = Uint256; `data`: `ByteListType` ; `gas`: `UintBigintType` = Uint64; `maxFeePerDataGas`: `UintBigintType` = Uint256; `maxFeePerGas`: `UintBigintType` = Uint256; `maxPriorityFeePerGas`: `UintBigintType` = Uint256; `nonce`: `UintBigintType` = Uint64; `to`: `UnionType`<(`ByteVectorType` \| `NoneType`)[]\> ; `value`: `UintBigintType` = Uint256 }\> = BlobTransactionType; `signature`: `ContainerType`<{ `r`: `UintBigintType` = Uint256; `s`: `UintBigintType` = Uint256; `yParity`: `BooleanType`  }\> = ECDSASignatureType }\>

#### Defined in

[types.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L390)

___

### kzg

• **kzg**: `Kzg`

#### Defined in

[kzg/kzg.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/kzg/kzg.ts#L8)

## Functions

### computeVersionedHash

▸ **computeVersionedHash**(`commitment`, `blobCommitmentVersion`): `Uint8Array`

Converts a vector commitment for a given data blob to its versioned hash.  For 4844, this version
number will be 0x01 for KZG vector commitments but could be different if future vector commitment
types are introduced

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commitment` | `Uint8Array` | a vector commitment to a blob |
| `blobCommitmentVersion` | `number` | the version number corresponding to the type of vector commitment |

#### Returns

`Uint8Array`

a versioned hash corresponding to a given blob vector commitment

#### Defined in

[utils/blobHelpers.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/utils/blobHelpers.ts#L74)

___

### initKZG

▸ **initKZG**(`kzgLib`, `trustedSetupPath`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `kzgLib` | `Kzg` | a KZG implementation (defaults to c-kzg) |
| `trustedSetupPath` | `string` | the full path (e.g. "/home/linux/devnet4.txt") to a kzg trusted setup text file |

#### Returns

`void`

#### Defined in

[kzg/kzg.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/kzg/kzg.ts#L21)

___

### isAccessList

▸ **isAccessList**(`input`): input is AccessList

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`AccessListBuffer`](README.md#accesslistbuffer) \| [`AccessList`](README.md#accesslist) |

#### Returns

input is AccessList

#### Defined in

[types.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L130)

___

### isAccessListBuffer

▸ **isAccessListBuffer**(`input`): input is AccessListBuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`AccessListBuffer`](README.md#accesslistbuffer) \| [`AccessList`](README.md#accesslist) |

#### Returns

input is AccessListBuffer

#### Defined in

[types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L117)
