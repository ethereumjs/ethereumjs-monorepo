[@ethereumjs/tx](../README.md) / types

# Module: types

## Table of contents

### Enumerations

- [Capabilities](../enums/types.capabilities.md)

### Interfaces

- [AccessListEIP2930TxData](../interfaces/types.accesslisteip2930txdata.md)
- [FeeMarketEIP1559TxData](../interfaces/types.feemarketeip1559txdata.md)
- [JsonTx](../interfaces/types.jsontx.md)
- [TxOptions](../interfaces/types.txoptions.md)

### Type aliases

- [AccessList](types.md#accesslist)
- [AccessListBuffer](types.md#accesslistbuffer)
- [AccessListBufferItem](types.md#accesslistbufferitem)
- [AccessListEIP2930ValuesArray](types.md#accesslisteip2930valuesarray)
- [AccessListItem](types.md#accesslistitem)
- [FeeMarketEIP1559ValuesArray](types.md#feemarketeip1559valuesarray)
- [TxData](types.md#txdata)
- [TxValuesArray](types.md#txvaluesarray)
- [TypedTransaction](types.md#typedtransaction)

### Variables

- [N\_DIV\_2](types.md#n_div_2)

### Functions

- [isAccessList](types.md#isaccesslist)
- [isAccessListBuffer](types.md#isaccesslistbuffer)

## Type aliases

### AccessList

Ƭ **AccessList**: [AccessListItem](types.md#accesslistitem)[]

#### Defined in

[types.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L79)

___

### AccessListBuffer

Ƭ **AccessListBuffer**: [AccessListBufferItem](types.md#accesslistbufferitem)[]

#### Defined in

[types.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L78)

___

### AccessListBufferItem

Ƭ **AccessListBufferItem**: [`Buffer`, `Buffer`[]]

#### Defined in

[types.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L77)

___

### AccessListEIP2930ValuesArray

Ƭ **AccessListEIP2930ValuesArray**: [`Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, [AccessListBuffer](types.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for an [AccessListEIP2930Transaction](index.md#accesslisteip2930transaction)

#### Defined in

[types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

___

### AccessListItem

Ƭ **AccessListItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `PrefixedHexString` |
| `storageKeys` | `PrefixedHexString`[] |

#### Defined in

[types.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L69)

___

### FeeMarketEIP1559ValuesArray

Ƭ **FeeMarketEIP1559ValuesArray**: [`Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, `Buffer`, [AccessListBuffer](types.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for a [FeeMarketEIP1559Transaction](index.md#feemarketeip1559transaction)

#### Defined in

[types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L223)

___

### TxData

Ƭ **TxData**: `Object`

Legacy [Transaction](index.md#transaction) Data

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `BufferLike` | This will contain the data of the message or the init of a contract. |
| `gasLimit?` | `BNLike` | The transaction's gas limit. |
| `gasPrice?` | `BNLike` | The transaction's gas price. |
| `nonce?` | `BNLike` | The transaction's nonce. |
| `r?` | `BNLike` | EC signature parameter. |
| `s?` | `BNLike` | EC signature parameter. |
| `to?` | `AddressLike` | The transaction's the address is sent to. |
| `type?` | `BNLike` | The transaction type |
| `v?` | `BNLike` | EC recovery ID. |
| `value?` | `BNLike` | The amount of Ether sent. |

#### Defined in

[types.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L112)

___

### TxValuesArray

Ƭ **TxValuesArray**: `Buffer`[]

Buffer values array for a legacy [Transaction](index.md#transaction)

#### Defined in

[types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

___

### TypedTransaction

Ƭ **TypedTransaction**: [default](../classes/legacytransaction.default.md) \| [default](../classes/eip2930transaction.default.md) \| [default](../classes/eip1559transaction.default.md)

Encompassing type for all transaction types.

Note that this also includes legacy txs which are
referenced as [Transaction](index.md#transaction) for compatibility reasons.

#### Defined in

[types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L104)

## Variables

### N\_DIV\_2

• `Const` **N\_DIV\_2**: `BN`

A const defining secp256k1n/2

#### Defined in

[types.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L268)

## Functions

### isAccessList

▸ **isAccessList**(`input`): input is AccessList

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [AccessListBuffer](types.md#accesslistbuffer) \| [AccessList](types.md#accesslist) |

#### Returns

input is AccessList

#### Defined in

[types.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L94)

___

### isAccessListBuffer

▸ **isAccessListBuffer**(`input`): input is AccessListBuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [AccessListBuffer](types.md#accesslistbuffer) \| [AccessList](types.md#accesslist) |

#### Returns

input is AccessListBuffer

#### Defined in

[types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L81)
