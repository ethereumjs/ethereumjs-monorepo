[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToHex

# Function: bytesToHex()

> **bytesToHex**(`bytes`): `` `0x${string}` ``

Defined in: [packages/util/src/bytes.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L43)

Converts a Uint8Array to a [PrefixedHexString](../type-aliases/PrefixedHexString.md)

## Parameters

### bytes

`Uint8Array`

the bytes to convert

## Returns

`` `0x${string}` ``

the hex string

## Dev

Returns `0x` if provided an empty Uint8Array
