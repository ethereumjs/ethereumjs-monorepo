[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunTxOpts

# Interface: RunTxOpts

Defined in: [vm/src/types.ts:385](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L385)

Options for the `runTx` method.

## Properties

### block?

> `optional` **block**: `Block`

Defined in: [vm/src/types.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L390)

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.

***

### blockGasUsed?

> `optional` **blockGasUsed**: `bigint`

Defined in: [vm/src/types.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L438)

To obtain an accurate tx receipt input the block gas used up until this tx.

***

### reportAccessList?

> `optional` **reportAccessList**: `boolean`

Defined in: [vm/src/types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L427)

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom StateManager implementation
StateManager.generateAccessList must be implemented.

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

Defined in: [vm/src/types.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L433)

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Defined in: [vm/src/types.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L403)

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

***

### skipBlockGasLimitValidation?

> `optional` **skipBlockGasLimitValidation**: `boolean`

Defined in: [vm/src/types.ts:409](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L409)

If true, skips the validation of the tx's gas limit
against the block's gas limit.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

Defined in: [vm/src/types.ts:415](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L415)

If true, skips the hardfork validation of vm, block
and tx

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

Defined in: [vm/src/types.ts:398](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L398)

If true, skips the nonce check

***

### tx

> **tx**: `TypedTransaction`

Defined in: [vm/src/types.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L394)

An `@ethereumjs/tx` to run
