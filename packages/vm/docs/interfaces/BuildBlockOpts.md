[@ethereumjs/vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Options for building a block.

## Table of contents

### Properties

- [blockOpts](BuildBlockOpts.md#blockopts)
- [headerData](BuildBlockOpts.md#headerdata)
- [parentBlock](BuildBlockOpts.md#parentblock)
- [withdrawals](BuildBlockOpts.md#withdrawals)

## Properties

### blockOpts

• `Optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

The block and builder options to use.

#### Defined in

[vm/src/types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L193)

___

### headerData

• `Optional` **headerData**: `HeaderData`

The block header data to use.
Defaults used for any values not provided.

#### Defined in

[vm/src/types.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L187)

___

### parentBlock

• **parentBlock**: `Block`

The parent block

#### Defined in

[vm/src/types.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L181)

___

### withdrawals

• `Optional` **withdrawals**: `WithdrawalData`[]

#### Defined in

[vm/src/types.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L189)
