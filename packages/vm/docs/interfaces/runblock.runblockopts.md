[@ethereumjs/vm](../README.md) / [runBlock](../modules/runblock.md) / RunBlockOpts

# Interface: RunBlockOpts

[runBlock](../modules/runblock.md).RunBlockOpts

Options for running a block.

## Table of contents

### Properties

- [block](runblock.runblockopts.md#block)
- [generate](runblock.runblockopts.md#generate)
- [root](runblock.runblockopts.md#root)
- [skipBalance](runblock.runblockopts.md#skipbalance)
- [skipBlockValidation](runblock.runblockopts.md#skipblockvalidation)
- [skipNonce](runblock.runblockopts.md#skipnonce)

## Properties

### block

• **block**: *Block*

The @ethereumjs/block to process

Defined in: [runBlock.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L35)

___

### generate

• `Optional` **generate**: *boolean*

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptsTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

Defined in: [runBlock.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L46)

___

### root

• `Optional` **root**: *Buffer*

Root of the state trie

Defined in: [runBlock.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L39)

___

### skipBalance

• `Optional` **skipBalance**: *boolean*

If true, skips the balance check

Defined in: [runBlock.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L60)

___

### skipBlockValidation

• `Optional` **skipBlockValidation**: *boolean*

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

Defined in: [runBlock.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L52)

___

### skipNonce

• `Optional` **skipNonce**: *boolean*

If true, skips the nonce check

Defined in: [runBlock.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L56)
