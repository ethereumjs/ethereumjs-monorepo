[@ethereumjs/block](../README.md) / JsonBlock

# Interface: JsonBlock

An object with the block's data represented as strings.

## Table of contents

### Properties

- [executionWitness](JsonBlock.md#executionwitness)
- [header](JsonBlock.md#header)
- [transactions](JsonBlock.md#transactions)
- [uncleHeaders](JsonBlock.md#uncleheaders)
- [withdrawals](JsonBlock.md#withdrawals)

## Properties

### executionWitness

• `Optional` **executionWitness**: ``null`` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Defined in

[types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L192)

___

### header

• `Optional` **header**: [`JsonHeader`](JsonHeader.md)

Header data for the block

#### Defined in

[types.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L188)

___

### transactions

• `Optional` **transactions**: `JsonTx`[]

#### Defined in

[types.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L189)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`JsonHeader`](JsonHeader.md)[]

#### Defined in

[types.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L190)

___

### withdrawals

• `Optional` **withdrawals**: `JsonRpcWithdrawal`[]

#### Defined in

[types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L191)
