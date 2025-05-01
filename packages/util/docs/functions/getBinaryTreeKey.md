[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeKey

# Function: getBinaryTreeKey()

> **getBinaryTreeKey**(`stem`, `leaf`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/binaryTree.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L116)

## Parameters

### stem

`Uint8Array`

The 31-bytes binary tree stem as a Uint8Array.

### leaf

`Uint8Array`\<`ArrayBufferLike`\> | [`BinaryTreeLeafType`](../type-aliases/BinaryTreeLeafType.md)

## Returns

`Uint8Array`\<`ArrayBufferLike`\>

The tree key as a Uint8Array.

## Dev

Returns the tree key for a given binary tree stem, and sub index.

## Dev

Assumes that the tree node width = 256
