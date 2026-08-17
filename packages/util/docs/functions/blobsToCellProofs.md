[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / blobsToCellProofs

# Function: blobsToCellProofs()

> **blobsToCellProofs**(`kzg`, `blobs`): `` `0x${string}` ``[]

Defined in: [packages/util/src/blobs.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L207)

EIP-7594: Computes cell proofs for the given blobs.

## Parameters

### kzg

[`KZG`](../interfaces/KZG.md)

KZG implementation capable of computing cell proofs

### blobs

`` `0x${string}` ``[]

Array of blob data as hex-prefixed strings

## Returns

`` `0x${string}` ``[]

Array of lowercase hex-prefixed cell proofs (aligned with input order)
