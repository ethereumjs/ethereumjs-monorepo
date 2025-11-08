[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunBlockOpts

# Interface: RunBlockOpts

Defined in: [vm/src/types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L252)

Options for running a block.

## Properties

### block

> **block**: `Block`

Defined in: [vm/src/types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L256)

The @ethereumjs/block to process

***

### clearCache?

> `optional` **clearCache**: `boolean`

Defined in: [vm/src/types.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L268)

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

***

### generate?

> `optional` **generate**: `boolean`

Defined in: [vm/src/types.ts:275](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L275)

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

Defined in: [vm/src/types.ts:316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L316)

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### root?

> `optional` **root**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L260)

Root of the state trie

***

### setHardfork?

> `optional` **setHardfork**: `boolean`

Defined in: [vm/src/types.ts:310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L310)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Defined in: [vm/src/types.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L303)

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

***

### skipBlockValidation?

> `optional` **skipBlockValidation**: `boolean`

Defined in: [vm/src/types.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L282)

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

Defined in: [vm/src/types.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L287)

If true, skips the hardfork validation of vm, block
and tx

***

### skipHeaderValidation?

> `optional` **skipHeaderValidation**: `boolean`

Defined in: [vm/src/types.ts:294](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L294)

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

Defined in: [vm/src/types.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L298)

If true, skips the nonce check

***

### validateBlockSize?

> `optional` **validateBlockSize**: `boolean`

Defined in: [vm/src/types.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L322)

If true, will validate block size limit (EIP-7934) when validating block data.
Defaults to false.
