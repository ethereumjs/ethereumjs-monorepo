[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / createBinaryTree

# Function: createBinaryTree()

> **createBinaryTree**(`opts?`): `Promise`\<[`BinaryTree`](../classes/BinaryTree.md)\>

Defined in: [constructors.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/constructors.ts#L25)

Creates a Binary Tree instance (EIP-7864 state tree).

Preferred entry point over constructing [BinaryTree](../classes/BinaryTree.md) directly.
Applies sensible defaults (`MapDB`, Blake3 hashing) and initializes an empty
root node when no persisted root is found.

## Parameters

### opts?

`Partial`\<[`BinaryTreeOpts`](../interfaces/BinaryTreeOpts.md)\>

Partial tree configuration (database, root persistence, cache size, hash function)

## Returns

`Promise`\<[`BinaryTree`](../classes/BinaryTree.md)\>

Initialized binary tree ready for reads and writes
