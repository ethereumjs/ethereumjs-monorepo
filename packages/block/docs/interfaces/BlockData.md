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

[types.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L107)

___

### transactions

• `Optional` **transactions**: (`AccessListEIP2930TxData` \| `BlobEIP4844TxData` \| `FeeMarketEIP1559TxData` \| `LegacyTxData`)[]

#### Defined in

[types.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L108)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

#### Defined in

[types.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L109)

___

### withdrawals

• `Optional` **withdrawals**: `WithdrawalData`[]

#### Defined in

[types.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L110)
