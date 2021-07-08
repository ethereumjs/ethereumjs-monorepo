[@ethereumjs/vm](../README.md) / [buildBlock](../modules/buildblock.md) / SealBlockOpts

# Interface: SealBlockOpts

[buildBlock](../modules/buildblock.md).SealBlockOpts

Options for sealing a block.

## Table of contents

### Properties

- [mixHash](buildblock.sealblockopts.md#mixhash)
- [nonce](buildblock.sealblockopts.md#nonce)

## Properties

### mixHash

• `Optional` **mixHash**: `Buffer`

For PoW, the mixHash.
Overrides the value passed in the constructor.

#### Defined in

[buildBlock.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L46)

___

### nonce

• `Optional` **nonce**: `Buffer`

For PoW, the nonce.
Overrides the value passed in the constructor.

#### Defined in

[buildBlock.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L40)
