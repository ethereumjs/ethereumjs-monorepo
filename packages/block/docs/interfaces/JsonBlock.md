[@ethereumjs/block](../README.md) / JsonBlock

# Interface: JsonBlock

An object with the block's data represented as strings.

## Table of contents

### Properties

- [header](JsonBlock.md#header)
- [transactions](JsonBlock.md#transactions)
- [uncleHeaders](JsonBlock.md#uncleheaders)
- [withdrawals](JsonBlock.md#withdrawals)

## Properties

### header

• `Optional` **header**: [`JsonHeader`](JsonHeader.md)

Header data for the block

#### Defined in

[types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L133)

___

### transactions

• `Optional` **transactions**: `JsonTx`[]

#### Defined in

[types.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L134)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`JsonHeader`](JsonHeader.md)[]

#### Defined in

[types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L135)

___

### withdrawals

• `Optional` **withdrawals**: `JsonRpcWithdrawal`[]

#### Defined in

[types.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L136)
