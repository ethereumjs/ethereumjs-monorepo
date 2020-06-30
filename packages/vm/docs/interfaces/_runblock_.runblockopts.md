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

• **block**: *any*

*Defined in [runBlock.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L16)*

The [`Block`](https://github.com/ethereumjs/ethereumjs-block) to process

___

### `Optional` generate

• **generate**? : *undefined | false | true*

*Defined in [runBlock.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L25)*

Whether to generate the stateRoot. If false `runBlock` will check the
stateRoot of the block against the Trie

___

### `Optional` root

• **root**? : *Buffer*

*Defined in [runBlock.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L20)*

Root of the state trie

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runBlock.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L37)*

If true, skips the balance check

___

### `Optional` skipBlockValidation

• **skipBlockValidation**? : *undefined | false | true*

*Defined in [runBlock.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L29)*

If true, will skip block validation

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runBlock.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L33)*

If true, skips the nonce check
