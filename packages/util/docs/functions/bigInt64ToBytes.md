[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bigInt64ToBytes

# Function: bigInt64ToBytes()

> **bigInt64ToBytes**(`value`, `littleEndian`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:490](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L490)

## Parameters

### value

`bigint`

The 64-bit bigint to convert.

### littleEndian

`boolean` = `false`

True for little-endian, undefined or false for big-endian.

## Returns

`Uint8Array`

A Uint8Array of length 8 containing the bigint.

## Notice

Convert a 64-bit bigint to a Uint8Array.
