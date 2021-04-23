[@ethereumjs/tx](../README.md) / [types](../modules/types.md) / AccessListEIP2930TxData

# Interface: AccessListEIP2930TxData

[types](../modules/types.md).AccessListEIP2930TxData

An object with an optional field with each of the transaction's values.

## Hierarchy

* [*TxData*](../modules/types.md#txdata)

  ↳ **AccessListEIP2930TxData**

## Table of contents

### Properties

- [accessList](types.accesslisteip2930txdata.md#accesslist)
- [chainId](types.accesslisteip2930txdata.md#chainid)
- [data](types.accesslisteip2930txdata.md#data)
- [gasLimit](types.accesslisteip2930txdata.md#gaslimit)
- [gasPrice](types.accesslisteip2930txdata.md#gasprice)
- [nonce](types.accesslisteip2930txdata.md#nonce)
- [r](types.accesslisteip2930txdata.md#r)
- [s](types.accesslisteip2930txdata.md#s)
- [to](types.accesslisteip2930txdata.md#to)
- [type](types.accesslisteip2930txdata.md#type)
- [v](types.accesslisteip2930txdata.md#v)
- [value](types.accesslisteip2930txdata.md#value)

## Properties

### accessList

• `Optional` **accessList**: [*AccessListBuffer*](../modules/types.md#accesslistbuffer) \| [*AccessList*](../modules/types.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

Defined in: [types.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L128)

___

### chainId

• `Optional` **chainId**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's chain ID

Defined in: [types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L123)

___

### data

• `Optional` **data**: *string* \| *number* \| *BN* \| *Buffer* \| *Uint8Array* \| *number*[] \| TransformableToBuffer

This will contain the data of the message or the init of a contract.

Inherited from: void

Defined in: [types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L98)

___

### gasLimit

• `Optional` **gasLimit**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's gas limit.

Inherited from: void

Defined in: [types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L83)

___

### gasPrice

• `Optional` **gasPrice**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's gas price.

Inherited from: void

Defined in: [types.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L78)

___

### nonce

• `Optional` **nonce**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's nonce.

Inherited from: void

Defined in: [types.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L73)

___

### r

• `Optional` **r**: *string* \| *number* \| *BN* \| *Buffer*

EC signature parameter.

Inherited from: void

Defined in: [types.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L108)

___

### s

• `Optional` **s**: *string* \| *number* \| *BN* \| *Buffer*

EC signature parameter.

Inherited from: void

Defined in: [types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L113)

___

### to

• `Optional` **to**: *string* \| *Address* \| *Buffer*

The transaction's the address is sent to.

Inherited from: void

Defined in: [types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L88)

___

### type

• `Optional` **type**: *string* \| *number* \| *BN* \| *Buffer*

The transaction type

Defined in: [types.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L134)

___

### v

• `Optional` **v**: *string* \| *number* \| *BN* \| *Buffer*

EC recovery ID.

Inherited from: void

Defined in: [types.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L103)

___

### value

• `Optional` **value**: *string* \| *number* \| *BN* \| *Buffer*

The amount of Ether sent.

Inherited from: void

Defined in: [types.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L93)
