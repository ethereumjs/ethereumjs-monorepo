[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / decodeRawMPTNode

# Function: decodeRawMPTNode()

> **decodeRawMPTNode**(`raw`): [`BranchMPTNode`](../classes/BranchMPTNode.md) \| [`ExtensionMPTNode`](../classes/ExtensionMPTNode.md) \| [`LeafMPTNode`](../classes/LeafMPTNode.md)

Defined in: [node/util.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/util.ts#L12)

Decode a raw RLP node array into a typed MPT node.

## Parameters

### raw

`Uint8Array`\<`ArrayBufferLike`\>[]

## Returns

[`BranchMPTNode`](../classes/BranchMPTNode.md) \| [`ExtensionMPTNode`](../classes/ExtensionMPTNode.md) \| [`LeafMPTNode`](../classes/LeafMPTNode.md)
