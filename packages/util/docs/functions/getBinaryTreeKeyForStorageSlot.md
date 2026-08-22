[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBinaryTreeKeyForStorageSlot

# Function: getBinaryTreeKeyForStorageSlot()

> **getBinaryTreeKeyForStorageSlot**(`address`, `storageKey`, `hashFunction`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/util/src/binaryTree.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L230)

Build the binary-tree key for an account storage slot.

## Parameters

### address

[`Address`](../classes/Address.md)

### storageKey

`bigint`

### hashFunction

(`input`) => `Uint8Array`

Hash used to derive the address stem

## Returns

`Uint8Array`\<`ArrayBuffer`\>
