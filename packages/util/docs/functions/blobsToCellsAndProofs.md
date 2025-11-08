[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / blobsToCellsAndProofs

# Function: blobsToCellsAndProofs()

> **blobsToCellsAndProofs**(`kzg`, `blobs`): \[`` `0x${string}` ``[], `` `0x${string}` ``[], `number`[]\]

Defined in: [packages/util/src/blobs.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L179)

EIP-7594: Computes extended cells and corresponding proofs for the given blobs.

## Parameters

### kzg

[`KZG`](../interfaces/KZG.md)

KZG implementation capable of computing cells and proofs

### blobs

`` `0x${string}` ``[]

Array of blob data as hex-prefixed strings

## Returns

\[`` `0x${string}` ``[], `` `0x${string}` ``[], `number`[]\]

Tuple of [cells, proofs, indices]; indices are 0..127
