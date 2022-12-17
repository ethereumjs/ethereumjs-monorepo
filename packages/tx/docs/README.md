@ethereumjs/tx

# @ethereumjs/tx

## Table of contents

### Enumerations

- [Capability](enums/Capability.md)

### Classes

- [AccessListEIP2930Transaction](classes/AccessListEIP2930Transaction.md)
- [FeeMarketEIP1559Transaction](classes/FeeMarketEIP1559Transaction.md)
- [Transaction](classes/Transaction.md)
- [TransactionFactory](classes/TransactionFactory.md)

### Interfaces

- [AccessListEIP2930TxData](interfaces/AccessListEIP2930TxData.md)
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

### Functions

- [isAccessList](README.md#isaccesslist)
- [isAccessListBuffer](README.md#isaccesslistbuffer)

## Type Aliases

### AccessList

Ƭ **AccessList**: [`AccessListItem`](README.md#accesslistitem)[]

#### Defined in

[types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L80)

___

### AccessListBuffer

Ƭ **AccessListBuffer**: [`AccessListBufferItem`](README.md#accesslistbufferitem)[]

#### Defined in

[types.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L79)

___

### AccessListBufferItem

Ƭ **AccessListBufferItem**: [`Buffer`, `Buffer`[]]

#### Defined in

[types.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L78)

___

### AccessListEIP2930ValuesArray

Ƭ **AccessListEIP2930ValuesArray**: [`Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, [`AccessListBuffer`](README.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for an [AccessListEIP2930Transaction](classes/AccessListEIP2930Transaction.md)

#### Defined in

[types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L208)

___

### AccessListItem

Ƭ **AccessListItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `PrefixedHexString` |
| `storageKeys` | `PrefixedHexString`[] |

#### Defined in

[types.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L70)

___

### FeeMarketEIP1559ValuesArray

Ƭ **FeeMarketEIP1559ValuesArray**: [`Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, [`AccessListBuffer`](README.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for a [FeeMarketEIP1559Transaction](classes/FeeMarketEIP1559Transaction.md)

#### Defined in

[types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L225)

___

### TxData

Ƭ **TxData**: `Object`

Legacy [Transaction](classes/Transaction.md) Data

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `BufferLike` | This will contain the data of the message or the init of a contract. |
| `gasLimit?` | `BigIntLike` | The transaction's gas limit. |
| `gasPrice?` | `BigIntLike` | The transaction's gas price. |
| `nonce?` | `BigIntLike` | The transaction's nonce. |
| `r?` | `BigIntLike` | EC signature parameter. |
| `s?` | `BigIntLike` | EC signature parameter. |
| `to?` | `AddressLike` | The transaction's the address is sent to. |
| `type?` | `BigIntLike` | The transaction type |
| `v?` | `BigIntLike` | EC recovery ID. |
| `value?` | `BigIntLike` | The amount of Ether sent. |

#### Defined in

[types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L113)

___

### TxValuesArray

Ƭ **TxValuesArray**: `Buffer`[]

Buffer values array for a legacy [Transaction](classes/Transaction.md)

#### Defined in

[types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L203)

___

### TypedTransaction

Ƭ **TypedTransaction**: [`Transaction`](classes/Transaction.md) \| [`AccessListEIP2930Transaction`](classes/AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](classes/FeeMarketEIP1559Transaction.md)

Encompassing type for all transaction types.

Note that this also includes legacy txs which are
referenced as [Transaction](classes/Transaction.md) for compatibility reasons.

#### Defined in

[types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L105)

## Functions

### isAccessList

▸ **isAccessList**(`input`): input is AccessList

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`AccessListBuffer`](README.md#accesslistbuffer) \| [`AccessList`](README.md#accesslist) |

#### Returns

input is AccessList

#### Defined in

[types.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L95)

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

[types.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L82)
