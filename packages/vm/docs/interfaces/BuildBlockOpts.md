[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Defined in: [vm/src/types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L221)

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts?**: [`BuilderOpts`](BuilderOpts.md)

Defined in: [vm/src/types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L237)

The block and builder options to use.

***

### headerData?

> `optional` **headerData?**: `HeaderData`

Defined in: [vm/src/types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L231)

The block header data to use.
Defaults used for any values not provided.

***

### parentBlock

> **parentBlock**: [`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

Defined in: [vm/src/types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L225)

The parent block

***

### withdrawals?

> `optional` **withdrawals?**: `WithdrawalData`[]

Defined in: [vm/src/types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L233)
