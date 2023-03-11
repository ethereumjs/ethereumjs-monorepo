[@ethereumjs/block](../README.md) / BlockData

# Interface: BlockData

A block's data.

## Table of contents

### Properties

- [header](BlockData.md#header)
- [transactions](BlockData.md#transactions)
- [uncleHeaders](BlockData.md#uncleheaders)
- [withdrawals](BlockData.md#withdrawals)

## Properties

### header

• `Optional` **header**: [`HeaderData`](HeaderData.md)

Header data for the block

#### Defined in

[types.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L116)

___

### transactions

• `Optional` **transactions**: (`AccessListEIP2930TxData` \| `TxData` \| `FeeMarketEIP1559TxData`)[]

#### Defined in

[types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L117)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L118)

___

### withdrawals

• `Optional` **withdrawals**: `WithdrawalData`[]

#### Defined in

[types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L119)
