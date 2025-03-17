[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getVerkleTreeKeyForCodeChunk

# Function: getVerkleTreeKeyForCodeChunk()

> **getVerkleTreeKeyForCodeChunk**(`address`, `chunkId`, `verkleCrypto`): `Promise`\<`Uint8Array`\>

Defined in: [packages/util/src/verkle.ts:232](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L232)

Asynchronously calculates the Verkle tree key for the specified code chunk ID.

## Parameters

### address

[`Address`](../classes/Address.md)

The account address to access code for.

### chunkId

`number`

The ID of the code chunk to retrieve.

### verkleCrypto

[`VerkleCrypto`](../interfaces/VerkleCrypto.md)

The cryptographic object used for Verkle-related operations.

## Returns

`Promise`\<`Uint8Array`\>

- A promise that resolves to the Verkle tree key as a byte array.
