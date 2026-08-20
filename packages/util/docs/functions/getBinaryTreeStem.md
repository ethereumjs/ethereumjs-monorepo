[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeStem

# Function: getBinaryTreeStem()

> **getBinaryTreeStem**(`hashFunction`, `address`, `treeIndex?`): `Uint8Array`

Defined in: [packages/util/src/binaryTree.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L22)

Build the 31-byte binary-tree stem for an address and tree index (EIP-7864).

## Parameters

### hashFunction

(`value`) => `Uint8Array`

Hash used to derive the stem from the padded address and index

### address

[`Address`](../classes/Address.md)

### treeIndex?

`number` \| `bigint`

Tree index; defaults to `0`

## Returns

`Uint8Array`
