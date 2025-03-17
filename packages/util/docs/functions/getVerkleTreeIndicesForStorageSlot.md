[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getVerkleTreeIndicesForStorageSlot

# Function: getVerkleTreeIndicesForStorageSlot()

> **getVerkleTreeIndicesForStorageSlot**(`storageKey`): `object`

Defined in: [packages/util/src/verkle.ts:196](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L196)

Calculates the position of the storage key in the Verkle tree, determining
both the tree index (the node in the tree) and the subindex (the position within the node).

## Parameters

### storageKey

`bigint`

The key representing a specific storage slot.

## Returns

`object`

- An object containing the tree index and subindex

### subIndex

> **subIndex**: `number`

### treeIndex

> **treeIndex**: `bigint`
