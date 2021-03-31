[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [RunBlockOpts](_runblock_.runblockopts.md)

# Interface: RunBlockOpts

Options for running a block.

## Hierarchy

* **RunBlockOpts**

## Index

### Properties

* [block](_runblock_.runblockopts.md#block)
* [generate](_runblock_.runblockopts.md#optional-generate)
* [root](_runblock_.runblockopts.md#optional-root)
* [skipBalance](_runblock_.runblockopts.md#optional-skipbalance)
* [skipBlockValidation](_runblock_.runblockopts.md#optional-skipblockvalidation)
* [skipNonce](_runblock_.runblockopts.md#optional-skipnonce)

## Properties

###  block

• **block**: *Block*

*Defined in [runBlock.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L29)*

The @ethereumjs/block to process

___

### `Optional` generate

• **generate**? : *undefined | false | true*

*Defined in [runBlock.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L40)*

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptsTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

___

### `Optional` root

• **root**? : *Buffer*

*Defined in [runBlock.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L33)*

Root of the state trie

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runBlock.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L54)*

If true, skips the balance check

___

### `Optional` skipBlockValidation

• **skipBlockValidation**? : *undefined | false | true*

*Defined in [runBlock.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L46)*

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runBlock.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L50)*

If true, skips the nonce check
