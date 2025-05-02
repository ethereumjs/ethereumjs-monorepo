[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getVerkleTreeKeyForStorageSlot

# Function: getVerkleTreeKeyForStorageSlot()

> **getVerkleTreeKeyForStorageSlot**(`address`, `storageKey`, `verkleCrypto`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/util/src/verkle.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L290)

Asynchronously calculates the Verkle tree key for the specified storage slot.

## Parameters

### address

[`Address`](../classes/Address.md)

The account address to access code for.

### storageKey

`bigint`

The storage slot key to retrieve the verkle key for.

### verkleCrypto

[`VerkleCrypto`](../interfaces/VerkleCrypto.md)

The cryptographic object used for Verkle-related operations.

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

- A promise that resolves to the Verkle tree key as a byte array.
