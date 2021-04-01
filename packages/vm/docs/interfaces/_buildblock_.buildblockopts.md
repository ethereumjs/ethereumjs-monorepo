[@ethereumjs/vm](../README.md) › ["buildBlock"](../modules/_buildblock_.md) › [BuildBlockOpts](_buildblock_.buildblockopts.md)

# Interface: BuildBlockOpts

Options for building a block.

## Hierarchy

* **BuildBlockOpts**

## Index

### Properties

* [blockOpts](_buildblock_.buildblockopts.md#optional-blockopts)
* [headerData](_buildblock_.buildblockopts.md#optional-headerdata)
* [parentBlock](_buildblock_.buildblockopts.md#parentblock)

## Properties

### `Optional` blockOpts

• **blockOpts**? : *BlockOptions*

*Defined in [buildBlock.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L29)*

The block options to use.

___

### `Optional` headerData

• **headerData**? : *HeaderData*

*Defined in [buildBlock.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L24)*

The block header data to use.
Defaults used for any values not provided.

___

###  parentBlock

• **parentBlock**: *Block*

*Defined in [buildBlock.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L18)*

The parent block
