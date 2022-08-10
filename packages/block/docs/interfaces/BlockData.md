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

[types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L99)

___

### transactions

• `Optional` **transactions**: (`AccessListEIP2930TxData` \| `TxData` \| `FeeMarketEIP1559TxData`)[]

#### Defined in

[types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L100)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

#### Defined in

[types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L101)
