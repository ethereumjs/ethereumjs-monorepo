[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeKeyForStorageSlot

# Function: getBinaryTreeKeyForStorageSlot()

> **getBinaryTreeKeyForStorageSlot**(`address`, `storageKey`, `hashFunction`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/binaryTree.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L226)

Asynchronously calculates the BinaryTree tree key for the specified storage slot.

## Parameters

### address

[`Address`](../classes/Address.md)

The account address to access code for.

### storageKey

`bigint`

The storage slot key to retrieve the key for.

### hashFunction

(`input`) => `Uint8Array`

The hash function used in the Binary Tree.

## Returns

`Uint8Array`\<`ArrayBufferLike`\>

- The BinaryTree tree key as a byte array.
