[@ethereumjs/block](../README.md) / BlockData

# Interface: BlockData

A block's data.

## Table of contents

### Properties

- [header](BlockData.md#header)
- [transactions](BlockData.md#transactions)
- [uncleHeaders](BlockData.md#uncleheaders)

## Properties

### header

• `Optional` **header**: [`HeaderData`](HeaderData.md)

Header data for the block

#### Defined in

[types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L119)

___

### transactions

• `Optional` **transactions**: (`TxData` \| `AccessListEIP2930TxData` \| `FeeMarketEIP1559TxData`)[]

#### Defined in

[types.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L120)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

#### Defined in

[types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L121)
