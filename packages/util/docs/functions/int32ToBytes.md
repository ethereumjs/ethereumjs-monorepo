[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / int32ToBytes

# Function: int32ToBytes()

> **int32ToBytes**(`value`, `littleEndian`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:477](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L477)

## Parameters

### value

`number`

The 32-bit integer to convert.

### littleEndian

`boolean` = `false`

True for little-endian, undefined or false for big-endian.

## Returns

`Uint8Array`

A Uint8Array of length 4 containing the integer.

## Notice

Convert a 32-bit integer to a Uint8Array.
