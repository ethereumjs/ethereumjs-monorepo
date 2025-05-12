[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getVerkleTreeIndicesForCodeChunk

# Function: getVerkleTreeIndicesForCodeChunk()

> **getVerkleTreeIndicesForCodeChunk**(`chunkId`): `object`

Defined in: [packages/util/src/verkle.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L220)

Calculates the position of the code chunks in the Verkle tree, determining
both the tree index (the node in the tree) and the subindex (the position within the node).

## Parameters

### chunkId

`number`

The ID representing a specific chunk.

## Returns

`object`

- An object containing the tree index and subindex

### subIndex

> **subIndex**: `number`

### treeIndex

> **treeIndex**: `number`
