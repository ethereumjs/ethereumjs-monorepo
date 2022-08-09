[@ethereumjs/vm](../README.md) / RunBlockOpts

# Interface: RunBlockOpts

Options for running a block.

## Table of contents

### Properties

- [block](RunBlockOpts.md#block)
- [generate](RunBlockOpts.md#generate)
- [hardforkByTTD](RunBlockOpts.md#hardforkbyttd)
- [root](RunBlockOpts.md#root)
- [skipBalance](RunBlockOpts.md#skipbalance)
- [skipBlockValidation](RunBlockOpts.md#skipblockvalidation)
- [skipHeaderValidation](RunBlockOpts.md#skipheadervalidation)
- [skipNonce](RunBlockOpts.md#skipnonce)

## Properties

### block

• **block**: `Block`

The @ethereumjs/block to process

#### Defined in

[packages/vm/src/types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L205)

___

### generate

• `Optional` **generate**: `boolean`

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

#### Defined in

[packages/vm/src/types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L216)

___

### hardforkByTTD

• `Optional` **hardforkByTTD**: `bigint`

For merge transition support, pass the chain TD up to the block being run

#### Defined in

[packages/vm/src/types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L241)

___

### root

• `Optional` **root**: `Buffer`

Root of the state trie

#### Defined in

[packages/vm/src/types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L209)

___

### skipBalance

• `Optional` **skipBalance**: `boolean`

If true, skips the balance check

#### Defined in

[packages/vm/src/types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L237)

___

### skipBlockValidation

• `Optional` **skipBlockValidation**: `boolean`

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

#### Defined in

[packages/vm/src/types.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L222)

___

### skipHeaderValidation

• `Optional` **skipHeaderValidation**: `boolean`

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

#### Defined in

[packages/vm/src/types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L229)

___

### skipNonce

• `Optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

[packages/vm/src/types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L233)
