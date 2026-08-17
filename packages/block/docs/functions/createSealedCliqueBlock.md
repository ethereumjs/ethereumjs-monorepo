[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createSealedCliqueBlock

# Function: createSealedCliqueBlock()

> **createSealedCliqueBlock**(`blockData`, `cliqueSigner`, `opts`): [`Block`](../classes/Block.md)

Defined in: [block/constructors.ts:385](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L385)

Creates a block for Clique networks with the seal applied during instantiation.

## Parameters

### blockData

[`BlockData`](../interfaces/BlockData.md) = `{}`

Block fields used to build the block

### cliqueSigner

`Uint8Array`

Private key bytes used to sign the header

### opts

[`BlockOptions`](../interfaces/BlockOptions.md) = `{}`

[BlockOptions](../interfaces/BlockOptions.md)

## Returns

[`Block`](../classes/Block.md)

A sealed Clique [Block](../classes/Block.md) object
