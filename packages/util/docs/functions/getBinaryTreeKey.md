[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeKey

# Function: getBinaryTreeKey()

> **getBinaryTreeKey**(`stem`, `leaf`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/util/src/binaryTree.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L133)

Combine a 31-byte stem with a leaf suffix to form a binary-tree key (node width 256).

## Parameters

### stem

`Uint8Array`

### leaf

`Uint8Array`\<`ArrayBufferLike`\> \| [`BinaryTreeLeafType`](../type-aliases/BinaryTreeLeafType.md)

[BinaryTreeLeafType](../variables/BinaryTreeLeafType.md) constant or raw suffix bytes

## Returns

`Uint8Array`\<`ArrayBuffer`\>
