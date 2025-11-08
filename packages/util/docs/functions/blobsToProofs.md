[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / blobsToProofs

# Function: blobsToProofs()

> **blobsToProofs**(`kzg`, `blobs`, `commitments`): `` `0x${string}` ``[]

Defined in: [packages/util/src/blobs.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L111)

EIP-4844: Computes KZG proofs for each blob/commitment pair.

## Parameters

### kzg

[`KZG`](../interfaces/KZG.md)

KZG implementation used to compute proofs

### blobs

`` `0x${string}` ``[]

Array of blob data as hex-prefixed strings

### commitments

`` `0x${string}` ``[]

Array of corresponding blob commitments

## Returns

`` `0x${string}` ``[]

Array of lowercase hex-prefixed proofs (aligned with input order)
