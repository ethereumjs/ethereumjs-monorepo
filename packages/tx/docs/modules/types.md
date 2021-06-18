[@ethereumjs/tx](../README.md) / types

# Module: types

## Table of contents

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

Ƭ **AccessList**: [*AccessListItem*](types.md#accesslistitem)[]

Defined in: [types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L49)

___

### AccessListBuffer

Ƭ **AccessListBuffer**: [*AccessListBufferItem*](types.md#accesslistbufferitem)[]

Defined in: [types.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L48)

___

### AccessListBufferItem

Ƭ **AccessListBufferItem**: [Buffer, Buffer[]]

Defined in: [types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L47)

___

### AccessListEIP2930ValuesArray

Ƭ **AccessListEIP2930ValuesArray**: [Buffer, Buffer, Buffer, Buffer, Buffer, Buffer, Buffer, [*AccessListBuffer*](types.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for an EIP2930 transaction

Defined in: [types.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L176)

___

### AccessListItem

Ƭ **AccessListItem**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | PrefixedHexString |
| `storageKeys` | PrefixedHexString[] |

Defined in: [types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L39)

___

### FeeMarketEIP1559ValuesArray

Ƭ **FeeMarketEIP1559ValuesArray**: [Buffer, Buffer, Buffer, Buffer, Buffer, Buffer, Buffer, Buffer, [*AccessListBuffer*](types.md#accesslistbuffer), Buffer?, Buffer?, Buffer?]

Buffer values array for an EIP1559 transaction

Defined in: [types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

___

### TxData

Ƭ **TxData**: *object*

Legacy Transaction Data

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | BufferLike | This will contain the data of the message or the init of a contract. |
| `gasLimit?` | BNLike | The transaction's gas limit. |
| `gasPrice?` | BNLike | The transaction's gas price. |
| `nonce?` | BNLike | The transaction's nonce. |
| `r?` | BNLike | EC signature parameter. |
| `s?` | BNLike | EC signature parameter. |
| `to?` | AddressLike | The transaction's the address is sent to. |
| `type?` | BNLike | The transaction type |
| `v?` | BNLike | EC recovery ID. |
| `value?` | BNLike | The amount of Ether sent. |

Defined in: [types.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L82)

___

### TxValuesArray

Ƭ **TxValuesArray**: Buffer[]

Buffer values array for a legacy transaction

Defined in: [types.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L171)

___

### TypedTransaction

Ƭ **TypedTransaction**: [*default*](../classes/legacytransaction.default.md) \| [*default*](../classes/eip2930transaction.default.md) \| [*default*](../classes/eip1559transaction.default.md)

Encompassing type for all transaction types.

Note that this also includes legacy txs which are
referenced as `Transaction` for compatibility reasons.

Defined in: [types.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L74)

## Variables

### N\_DIV\_2

• `Const` **N\_DIV\_2**: *BN*

A const defining secp256k1n/2

Defined in: [types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L238)

## Functions

### isAccessList

▸ **isAccessList**(`input`: [*AccessListBuffer*](types.md#accesslistbuffer) \| [*AccessList*](types.md#accesslist)): input is AccessList

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [*AccessListBuffer*](types.md#accesslistbuffer) \| [*AccessList*](types.md#accesslist) |

**Returns:** input is AccessList

Defined in: [types.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L64)

___

### isAccessListBuffer

▸ **isAccessListBuffer**(`input`: [*AccessListBuffer*](types.md#accesslistbuffer) \| [*AccessList*](types.md#accesslist)): input is AccessListBuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [*AccessListBuffer*](types.md#accesslistbuffer) \| [*AccessList*](types.md#accesslist) |

**Returns:** input is AccessListBuffer

Defined in: [types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L51)
