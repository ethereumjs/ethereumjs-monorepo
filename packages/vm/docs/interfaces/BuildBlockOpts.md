[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Defined in: [vm/src/types.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L213)

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

Defined in: [vm/src/types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L229)

The block and builder options to use.

***

### headerData?

> `optional` **headerData**: `HeaderData`

Defined in: [vm/src/types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L223)

The block header data to use.
Defaults used for any values not provided.

***

### parentBlock

> **parentBlock**: `Block`

Defined in: [vm/src/types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L217)

The parent block

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

Defined in: [vm/src/types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L225)
