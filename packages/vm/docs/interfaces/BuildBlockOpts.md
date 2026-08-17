[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Defined in: [vm/src/types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L215)

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

Defined in: [vm/src/types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L231)

The block and builder options to use.

***

### headerData?

> `optional` **headerData**: `HeaderData`

Defined in: [vm/src/types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L225)

The block header data to use.
Defaults used for any values not provided.

***

### parentBlock

> **parentBlock**: `Block`

Defined in: [vm/src/types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L219)

The parent block

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

Defined in: [vm/src/types.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L227)
