[@ethereumjs/vm](../README.md) / RunBlockOpts

# Interface: RunBlockOpts

Options for running a block.

## Table of contents

### Properties

- [block](RunBlockOpts.md#block)
- [clearCache](RunBlockOpts.md#clearcache)
- [generate](RunBlockOpts.md#generate)
- [reportPreimages](RunBlockOpts.md#reportpreimages)
- [root](RunBlockOpts.md#root)
- [setHardfork](RunBlockOpts.md#sethardfork)
- [skipBalance](RunBlockOpts.md#skipbalance)
- [skipBlockValidation](RunBlockOpts.md#skipblockvalidation)
- [skipHardForkValidation](RunBlockOpts.md#skiphardforkvalidation)
- [skipHeaderValidation](RunBlockOpts.md#skipheadervalidation)
- [skipNonce](RunBlockOpts.md#skipnonce)

## Properties

### block

• **block**: `Block`

The @ethereumjs/block to process

#### Defined in

[vm/src/types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L220)

___

### clearCache

• `Optional` **clearCache**: `boolean`

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

#### Defined in

[vm/src/types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L232)

___

### generate

• `Optional` **generate**: `boolean`

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

#### Defined in

[vm/src/types.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L239)

___

### reportPreimages

• `Optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Defined in

[vm/src/types.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L282)

___

### root

• `Optional` **root**: `Uint8Array`

Root of the state trie

#### Defined in

[vm/src/types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L224)

___

### setHardfork

• `Optional` **setHardfork**: `boolean` \| `BigIntLike`

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Defined in

[vm/src/types.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L276)

___

### skipBalance

• `Optional` **skipBalance**: `boolean`

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

#### Defined in

[vm/src/types.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L266)

___

### skipBlockValidation

• `Optional` **skipBlockValidation**: `boolean`

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

#### Defined in

[vm/src/types.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L245)

___

### skipHardForkValidation

• `Optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Defined in

[vm/src/types.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L250)

___

### skipHeaderValidation

• `Optional` **skipHeaderValidation**: `boolean`

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

#### Defined in

[vm/src/types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L257)

___

### skipNonce

• `Optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

[vm/src/types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L261)
