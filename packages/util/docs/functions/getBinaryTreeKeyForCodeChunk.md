[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeKeyForCodeChunk

# Function: getBinaryTreeKeyForCodeChunk()

> **getBinaryTreeKeyForCodeChunk**(`address`, `chunkId`, `hashFunction`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/util/src/binaryTree.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L174)

Build the binary-tree key for a contract code chunk.

## Parameters

### address

[`Address`](../classes/Address.md)

### chunkId

`number`

### hashFunction

(`input`) => `Uint8Array`

Hash used to derive the address stem

## Returns

`Uint8Array`\<`ArrayBuffer`\>
