[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeStem

# Function: getBinaryTreeStem()

> **getBinaryTreeStem**(`hashFunction`, `address`, `treeIndex`): `Uint8Array`

Defined in: [packages/util/src/binaryTree.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L23)

## Parameters

### hashFunction

(`value`) => `Uint8Array`

The hashFunction for the binary tree

### address

[`Address`](../classes/Address.md)

The address to generate the tree key for.

### treeIndex

The index of the tree to generate the key for. Defaults to 0.

`number` | `bigint`

## Returns

`Uint8Array`

The 31-bytes binary tree stem as a Uint8Array.

## Dev

Returns the 31-bytes binary tree stem for a given address and tree index.
