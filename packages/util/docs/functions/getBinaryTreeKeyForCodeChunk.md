[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeKeyForCodeChunk

# Function: getBinaryTreeKeyForCodeChunk()

> **getBinaryTreeKeyForCodeChunk**(`address`, `chunkId`, `hashFunction`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/binaryTree.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L169)

Asynchronously calculates the BinaryTree tree key for the specified code chunk ID.

## Parameters

### address

[`Address`](../classes/Address.md)

The account address to access code for.

### chunkId

`number`

The ID of the code chunk to retrieve.

### hashFunction

(`input`) => `Uint8Array`

The hash function used for BinaryTree-related operations.

## Returns

`Uint8Array`\<`ArrayBufferLike`\>

- The BinaryTree tree key as a byte array.
