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

[types.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L106)

___

### transactions

• `Optional` **transactions**: (`AccessListEIP2930TxData` \| `TxData` \| `FeeMarketEIP1559TxData`)[]

#### Defined in

[types.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L107)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

#### Defined in

[types.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L108)
