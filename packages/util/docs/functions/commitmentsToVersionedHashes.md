[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / commitmentsToVersionedHashes

# Function: commitmentsToVersionedHashes()

> **commitmentsToVersionedHashes**(`commitments`): `` `0x${string}` ``[]

Defined in: [packages/util/src/blobs.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L147)

EIP-4844: Generate an array of versioned hashes from corresponding kzg commitments

## Parameters

### commitments

`` `0x${string}` ``[]

array of kzg commitments

## Returns

`` `0x${string}` ``[]

array of versioned hashes
Note: assumes KZG commitments (version 1 version hashes)
