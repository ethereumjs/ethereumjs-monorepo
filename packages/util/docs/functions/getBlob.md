[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBlob

# Function: getBlob()

> **getBlob**(`data`): `` `0x${string}` ``

Defined in: [packages/util/src/blobs.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L39)

Converts arbitrary byte data into EIP-4844 blob format.
Splits data into 4096 field elements of 32 bytes each, with proper alignment.

## Parameters

### data

`Uint8Array`

Input data (must be exactly BLOB_SIZE bytes)

## Returns

`` `0x${string}` ``

Hex-prefixed blob string
