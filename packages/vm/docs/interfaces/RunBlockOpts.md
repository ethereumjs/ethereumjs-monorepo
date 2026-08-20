[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunBlockOpts

# Interface: RunBlockOpts

Defined in: [vm/src/types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L260)

Options for running a block.

## Properties

### block

> **block**: `Block`

Defined in: [vm/src/types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L264)

The Block to process

***

### blockAccessList?

> `optional` **blockAccessList?**: `Uint8Array`\<`ArrayBufferLike`\> \| `BlockLevelAccessList` \| `BALJSONBlockAccessList`

Defined in: [vm/src/types.ts:340](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L340)

Block-level access list supplied with the block (e.g. from an execution payload).
When set and EIP-7928 is active, [runBlock](../functions/runBlock.md) validates structure and header hash
before execution and RLP equality against the generated list after execution.

#### Remarks

Experimental (Amsterdam): may change on patch releases. See `@ethereumjs/vm`
README section `Amsterdam hardfork (experimental)` for release ↔ spec tracking.

***

### clearCache?

> `optional` **clearCache?**: `boolean`

Defined in: [vm/src/types.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L276)

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

***

### generate?

> `optional` **generate?**: `boolean`

Defined in: [vm/src/types.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L283)

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

***

### reportPreimages?

> `optional` **reportPreimages?**: `boolean`

Defined in: [vm/src/types.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L324)

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### root?

> `optional` **root?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/types.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L268)

Root of the state trie

***

### setHardfork?

> `optional` **setHardfork?**: `boolean`

Defined in: [vm/src/types.ts:318](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L318)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### skipBalance?

> `optional` **skipBalance?**: `boolean`

Defined in: [vm/src/types.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L311)

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

***

### skipBlockValidation?

> `optional` **skipBlockValidation?**: `boolean`

Defined in: [vm/src/types.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L290)

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation?**: `boolean`

Defined in: [vm/src/types.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L295)

If true, skips the hardfork validation of vm, block
and tx

***

### skipHeaderValidation?

> `optional` **skipHeaderValidation?**: `boolean`

Defined in: [vm/src/types.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L302)

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

***

### skipNonce?

> `optional` **skipNonce?**: `boolean`

Defined in: [vm/src/types.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L306)

If true, skips the nonce check

***

### validateBlockSize?

> `optional` **validateBlockSize?**: `boolean`

Defined in: [vm/src/types.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L330)

If true, will validate block size limit (EIP-7934) when validating block data.
Defaults to false.
