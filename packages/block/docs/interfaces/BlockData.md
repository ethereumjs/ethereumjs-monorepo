[@ethereumjs/block](../README.md) / BlockData

# Interface: BlockData

A block's data.

## Table of contents

### Properties

- [executionWitness](BlockData.md#executionwitness)
- [header](BlockData.md#header)
- [transactions](BlockData.md#transactions)
- [uncleHeaders](BlockData.md#uncleheaders)
- [withdrawals](BlockData.md#withdrawals)

## Properties

### executionWitness

• `Optional` **executionWitness**: ``null`` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

EIP-6800: Verkle Proof Data (experimental)

#### Defined in

[types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L153)

___

### header

• `Optional` **header**: [`HeaderData`](HeaderData.md)

Header data for the block

#### Defined in

[types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L146)

___

### transactions

• `Optional` **transactions**: (`AccessListEIP2930TxData` \| `BlobEIP4844TxData` \| `FeeMarketEIP1559TxData` \| `LegacyTxData`)[]

#### Defined in

[types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L147)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

#### Defined in

[types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L148)

___

### withdrawals

• `Optional` **withdrawals**: `WithdrawalData`[]

#### Defined in

[types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L149)
