[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToBigInt64

# Function: bytesToBigInt64()

> **bytesToBigInt64**(`bytes`, `littleEndian`): `bigint`

Defined in: [packages/util/src/bytes.ts:463](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L463)

## Parameters

### bytes

`Uint8Array`

The input Uint8Array from which to read the 64-bit bigint.

### littleEndian

`boolean` = `false`

True for little-endian, undefined or false for big-endian.

## Returns

`bigint`

The 64-bit bigint read from the input Uint8Array.

## Notice

Convert a Uint8Array to a 64-bit bigint
