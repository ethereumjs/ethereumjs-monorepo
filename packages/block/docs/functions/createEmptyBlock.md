[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createEmptyBlock

# Function: createEmptyBlock()

> **createEmptyBlock**(`headerData`, `opts?`): [`Block`](../classes/Block.md)

Defined in: [block/constructors.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L102)

Simple static constructor if only an empty block is needed
(tree shaking advantages since it does not draw all the tx constructors in)

## Parameters

### headerData

[`HeaderData`](../interfaces/HeaderData.md)

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

[`Block`](../classes/Block.md)
