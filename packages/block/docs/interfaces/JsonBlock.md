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

[types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L143)

___

### transactions

• `Optional` **transactions**: `JsonTx`[]

#### Defined in

[types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L144)

___

### uncleHeaders

• `Optional` **uncleHeaders**: [`JsonHeader`](JsonHeader.md)[]

#### Defined in

[types.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L145)

___

### withdrawals

• `Optional` **withdrawals**: `JsonRpcWithdrawal`[]

#### Defined in

[types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L146)
