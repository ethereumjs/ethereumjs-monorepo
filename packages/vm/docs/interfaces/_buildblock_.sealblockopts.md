[@ethereumjs/vm](../README.md) › ["buildBlock"](../modules/_buildblock_.md) › [SealBlockOpts](_buildblock_.sealblockopts.md)

# Interface: SealBlockOpts

Options for sealing a block.

## Hierarchy

* **SealBlockOpts**

## Index

### Properties

* [mixHash](_buildblock_.sealblockopts.md#optional-mixhash)
* [nonce](_buildblock_.sealblockopts.md#optional-nonce)

## Properties

### `Optional` mixHash

• **mixHash**? : *Buffer*

*Defined in [buildBlock.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L46)*

For PoW, the mixHash.
Overrides the value passed in the constructor.

___

### `Optional` nonce

• **nonce**? : *Buffer*

*Defined in [buildBlock.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L40)*

For PoW, the nonce.
Overrides the value passed in the constructor.
