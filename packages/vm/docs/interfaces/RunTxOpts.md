[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunTxOpts

# Interface: RunTxOpts

Defined in: [vm/src/types.ts:414](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L414)

Options for the `runTx` method.

## Properties

### block?

> `optional` **block?**: [`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

Defined in: [vm/src/types.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L419)

The [Block](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md) the transaction belongs to.
If omitted, a default blank block is used.

***

### blockGasUsed?

> `optional` **blockGasUsed?**: `bigint`

Defined in: [vm/src/types.ts:467](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L467)

To obtain an accurate tx receipt input the block gas used up until this tx.

***

### reportAccessList?

> `optional` **reportAccessList?**: `boolean`

Defined in: [vm/src/types.ts:456](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L456)

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom [@ethereumjs/common!StateManagerInterface](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/StateManagerInterface.md) implementation,
`generateAccessList()` must be implemented on that class.

***

### reportPreimages?

> `optional` **reportPreimages?**: `boolean`

Defined in: [vm/src/types.ts:462](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L462)

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### skipBalance?

> `optional` **skipBalance?**: `boolean`

Defined in: [vm/src/types.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L432)

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

***

### skipBlockGasLimitValidation?

> `optional` **skipBlockGasLimitValidation?**: `boolean`

Defined in: [vm/src/types.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L438)

If true, skips the validation of the tx's gas limit
against the block's gas limit.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation?**: `boolean`

Defined in: [vm/src/types.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L444)

If true, skips the hardfork validation of vm, block
and tx

***

### skipNonce?

> `optional` **skipNonce?**: `boolean`

Defined in: [vm/src/types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L427)

If true, skips the nonce check

***

### tx

> **tx**: `TypedTransaction`

Defined in: [vm/src/types.ts:423](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L423)

Signed transaction to execute
