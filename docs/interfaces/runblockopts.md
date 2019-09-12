[ethereumjs-vm](../README.md) > [RunBlockOpts](../interfaces/runblockopts.md)

# Interface: RunBlockOpts

Options for running a block.

## Hierarchy

**RunBlockOpts**

## Index

### Properties

* [block](runblockopts.md#block)
* [generate](runblockopts.md#generate)
* [root](runblockopts.md#root)
* [skipBlockValidation](runblockopts.md#skipblockvalidation)

---

## Properties

<a id="block"></a>

###  block

**● block**: *`any`*

*Defined in [runBlock.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L18)*

The [`Block`](https://github.com/ethereumjs/ethereumjs-block) to process

___
<a id="generate"></a>

### `<Optional>` generate

**● generate**: *`undefined` \| `false` \| `true`*

*Defined in [runBlock.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L27)*

Whether to generate the stateRoot. If false `runBlock` will check the stateRoot of the block against the Trie

___
<a id="root"></a>

### `<Optional>` root

**● root**: *`Buffer`*

*Defined in [runBlock.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L22)*

Root of the state trie

___
<a id="skipblockvalidation"></a>

### `<Optional>` skipBlockValidation

**● skipBlockValidation**: *`undefined` \| `false` \| `true`*

*Defined in [runBlock.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runBlock.ts#L31)*

If true, will skip block validation

___

