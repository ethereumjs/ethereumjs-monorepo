[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getBlobs

# Function: getBlobs()

> **getBlobs**(`input`): `` `0x${string}` ``[]

Defined in: [packages/util/src/blobs.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L62)

EIP-4844: Converts UTF-8 string(s) into EIP-4844 blob format.

Each input string is converted to UTF-8 bytes, padded with 0x80 followed by zeros
to align with blob boundaries, and encoded as one or more blobs depending on size.
Multiple inputs are processed sequentially, with each input contributing its own blob(s).

## Parameters

### input

Single UTF-8 string or array of UTF-8 strings to encode

`string` | `string`[]

## Returns

`` `0x${string}` ``[]

Array of hex-prefixed blob strings (0x...), one blob per 131,071 useful bytes per input

## Throws

Error with message 'invalid blob data' if any input string is empty

## Throws

Error with message 'blob data is too large' if any single input exceeds MAX_USEFUL_BYTES_PER_TX
