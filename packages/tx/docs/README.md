@ethereumjs/tx

# @ethereumjs/tx

## Table of contents

### Enumerations

- [Capability](enums/Capability.md)
- [TransactionType](enums/TransactionType.md)

### Classes

- [AccessListEIP2930Transaction](classes/AccessListEIP2930Transaction.md)
- [BlobEIP4844Transaction](classes/BlobEIP4844Transaction.md)
- [FeeMarketEIP1559Transaction](classes/FeeMarketEIP1559Transaction.md)
- [LegacyTransaction](classes/LegacyTransaction.md)
- [TransactionFactory](classes/TransactionFactory.md)

### Interfaces

- [AccessListEIP2930TxData](interfaces/AccessListEIP2930TxData.md)
- [BlobEIP4844TxData](interfaces/BlobEIP4844TxData.md)
- [FeeMarketEIP1559TxData](interfaces/FeeMarketEIP1559TxData.md)
- [JsonRpcTx](interfaces/JsonRpcTx.md)
- [JsonTx](interfaces/JsonTx.md)
- [Transaction](interfaces/Transaction.md)
- [TransactionInterface](interfaces/TransactionInterface.md)
- [TxData](interfaces/TxData.md)
- [TxOptions](interfaces/TxOptions.md)
- [TxValuesArray](interfaces/TxValuesArray.md)

### Type Aliases

- [AccessList](README.md#accesslist)
- [AccessListBytes](README.md#accesslistbytes)
- [AccessListBytesItem](README.md#accesslistbytesitem)
- [AccessListItem](README.md#accesslistitem)
- [BlobEIP4844NetworkValuesArray](README.md#blobeip4844networkvaluesarray)
- [LegacyTxData](README.md#legacytxdata)
- [TypedTransaction](README.md#typedtransaction)
- [TypedTxData](README.md#typedtxdata)

### Functions

- [isAccessList](README.md#isaccesslist)
- [isAccessListBytes](README.md#isaccesslistbytes)
- [isAccessListEIP2930Tx](README.md#isaccesslisteip2930tx)
- [isAccessListEIP2930TxData](README.md#isaccesslisteip2930txdata)
- [isBlobEIP4844Tx](README.md#isblobeip4844tx)
- [isBlobEIP4844TxData](README.md#isblobeip4844txdata)
- [isFeeMarketEIP1559Tx](README.md#isfeemarketeip1559tx)
- [isFeeMarketEIP1559TxData](README.md#isfeemarketeip1559txdata)
- [isLegacyTx](README.md#islegacytx)
- [isLegacyTxData](README.md#islegacytxdata)

## Type Aliases

### AccessList

Ƭ **AccessList**: [`AccessListItem`](README.md#accesslistitem)[]

#### Defined in

common/dist/cjs/interfaces.d.ts:29

___

### AccessListBytes

Ƭ **AccessListBytes**: [`AccessListBytesItem`](README.md#accesslistbytesitem)[]

#### Defined in

common/dist/cjs/interfaces.d.ts:28

___

### AccessListBytesItem

Ƭ **AccessListBytesItem**: [`Uint8Array`, `Uint8Array`[]]

#### Defined in

common/dist/cjs/interfaces.d.ts:27

___

### AccessListItem

Ƭ **AccessListItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `PrefixedHexString` |
| `storageKeys` | `PrefixedHexString`[] |

#### Defined in

common/dist/cjs/interfaces.d.ts:23

___

### BlobEIP4844NetworkValuesArray

Ƭ **BlobEIP4844NetworkValuesArray**: [`BlobEIP4844TxValuesArray`, `Uint8Array`[], `Uint8Array`[], `Uint8Array`[]]

#### Defined in

[tx/src/types.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L371)

___

### LegacyTxData

Ƭ **LegacyTxData**: `Object`

Legacy [Transaction](interfaces/Transaction.md) Data

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `BytesLike` | This will contain the data of the message or the init of a contract. |
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

[tx/src/types.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L187)

___

### TypedTransaction

Ƭ **TypedTransaction**: [`Transaction`](interfaces/Transaction.md)[[`TransactionType`](enums/TransactionType.md)]

#### Defined in

[tx/src/types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L113)

___

### TypedTxData

Ƭ **TypedTxData**: [`TxData`](interfaces/TxData.md)[[`TransactionType`](enums/TransactionType.md)]

#### Defined in

[tx/src/types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L162)

## Functions

### isAccessList

▸ **isAccessList**(`input`): input is AccessList

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`AccessListBytes`](README.md#accesslistbytes) \| [`AccessList`](README.md#accesslist) |

#### Returns

input is AccessList

#### Defined in

[tx/src/types.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L92)

___

### isAccessListBytes

▸ **isAccessListBytes**(`input`): input is AccessListBytes

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`AccessListBytes`](README.md#accesslistbytes) \| [`AccessList`](README.md#accesslist) |

#### Returns

input is AccessListBytes

#### Defined in

[tx/src/types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L81)

___

### isAccessListEIP2930Tx

▸ **isAccessListEIP2930Tx**(`tx`): tx is AccessListEIP2930Transaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](README.md#typedtransaction) |

#### Returns

tx is AccessListEIP2930Transaction

#### Defined in

[tx/src/types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L119)

___

### isAccessListEIP2930TxData

▸ **isAccessListEIP2930TxData**(`txData`): txData is AccessListEIP2930TxData

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`TypedTxData`](README.md#typedtxdata) |

#### Returns

txData is AccessListEIP2930TxData

#### Defined in

[tx/src/types.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L169)

___

### isBlobEIP4844Tx

▸ **isBlobEIP4844Tx**(`tx`): tx is BlobEIP4844Transaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](README.md#typedtransaction) |

#### Returns

tx is BlobEIP4844Transaction

#### Defined in

[tx/src/types.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L127)

___

### isBlobEIP4844TxData

▸ **isBlobEIP4844TxData**(`txData`): txData is BlobEIP4844TxData

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`TypedTxData`](README.md#typedtxdata) |

#### Returns

txData is BlobEIP4844TxData

#### Defined in

[tx/src/types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

___

### isFeeMarketEIP1559Tx

▸ **isFeeMarketEIP1559Tx**(`tx`): tx is FeeMarketEIP1559Transaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](README.md#typedtransaction) |

#### Returns

tx is FeeMarketEIP1559Transaction

#### Defined in

[tx/src/types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L123)

___

### isFeeMarketEIP1559TxData

▸ **isFeeMarketEIP1559TxData**(`txData`): txData is FeeMarketEIP1559TxData

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`TypedTxData`](README.md#typedtxdata) |

#### Returns

txData is FeeMarketEIP1559TxData

#### Defined in

[tx/src/types.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L174)

___

### isLegacyTx

▸ **isLegacyTx**(`tx`): tx is LegacyTransaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](README.md#typedtransaction) |

#### Returns

tx is LegacyTransaction

#### Defined in

[tx/src/types.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L115)

___

### isLegacyTxData

▸ **isLegacyTxData**(`txData`): txData is LegacyTxData

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`TypedTxData`](README.md#typedtxdata) |

#### Returns

txData is LegacyTxData

#### Defined in

[tx/src/types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)
