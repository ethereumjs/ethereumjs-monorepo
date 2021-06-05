[@ethereumjs/block](../README.md) / [types](../modules/types.md) / BlockData

# Interface: BlockData

[types](../modules/types.md).BlockData

A block's data.

## Table of contents

### Properties

- [header](types.blockdata.md#header)
- [transactions](types.blockdata.md#transactions)
- [uncleHeaders](types.blockdata.md#uncleheaders)

## Properties

### header

• `Optional` **header**: [*HeaderData*](types.headerdata.md)

Header data for the block

Defined in: [types.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L96)

___

### transactions

• `Optional` **transactions**: (TxData \| *AccessListEIP2930TxData* \| *FeeMarketEIP1559TxData*)[]

Defined in: [types.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L97)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [*HeaderData*](types.headerdata.md)[]

Defined in: [types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L98)
