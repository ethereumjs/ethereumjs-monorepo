[@ethereumjs/vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Options for building a block.

## Table of contents

### Properties

- [blockOpts](BuildBlockOpts.md#blockopts)
- [headerData](BuildBlockOpts.md#headerdata)
- [parentBlock](BuildBlockOpts.md#parentblock)

## Properties

### blockOpts

• `Optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

The block and builder options to use.

#### Defined in

[packages/vm/src/types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L178)

___

### headerData

• `Optional` **headerData**: `HeaderData`

The block header data to use.
Defaults used for any values not provided.

#### Defined in

[packages/vm/src/types.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L173)

___

### parentBlock

• **parentBlock**: `Block`

The parent block

#### Defined in

[packages/vm/src/types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L167)
