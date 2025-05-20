[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeIndicesForStorageSlot

# Function: getBinaryTreeIndicesForStorageSlot()

> **getBinaryTreeIndicesForStorageSlot**(`storageKey`): `object`

Defined in: [packages/util/src/binaryTree.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L133)

Calculates the position of the storage key in the BinaryTree tree, determining
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
