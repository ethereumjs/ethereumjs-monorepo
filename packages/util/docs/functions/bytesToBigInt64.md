[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToBigInt64

# Function: bytesToBigInt64()

> **bytesToBigInt64**(`bytes`, `littleEndian?`): `bigint`

Defined in: [packages/util/src/bytes.ts:451](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L451)

Convert a Uint8Array to a 64-bit bigint.

## Parameters

### bytes

`Uint8Array`

The input bytes from which to read the bigint

### littleEndian?

`boolean` = `false`

True for little-endian, false for big-endian (default)

## Returns

`bigint`

The 64-bit bigint
