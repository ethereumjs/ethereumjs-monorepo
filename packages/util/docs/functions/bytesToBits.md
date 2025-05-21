[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToBits

# Function: bytesToBits()

> **bytesToBits**(`bytes`, `bitLength?`): `number`[]

Defined in: [packages/util/src/bytes.ts:509](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L509)

Converts a Uint8Array of bytes into an array of bits.

## Parameters

### bytes

`Uint8Array`

The input byte array.

### bitLength?

`number`

The number of bits to extract from the input bytes.

## Returns

`number`[]

An array of bits (each 0 or 1) corresponding to the input bytes.
