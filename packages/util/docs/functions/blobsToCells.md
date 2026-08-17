[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / blobsToCells

# Function: blobsToCells()

> **blobsToCells**(`kzg`, `blobs`): \[`` `0x${string}` ``[], `number`[]\]

Defined in: [packages/util/src/blobs.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L161)

EIP-7594: Expands blobs into their extended cells using the provided KZG implementation.

## Parameters

### kzg

[`KZG`](../interfaces/KZG.md)

KZG implementation capable of computing cells

### blobs

`` `0x${string}` ``[]

Array of blob data as hex-prefixed strings

## Returns

\[`` `0x${string}` ``[], `number`[]\]

Tuple of [cells, indices], where cells are hex strings and indices are 0..127
