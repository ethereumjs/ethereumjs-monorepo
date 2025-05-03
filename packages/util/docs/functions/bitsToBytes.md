[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bitsToBytes

# Function: bitsToBytes()

> **bitsToBytes**(`bits`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:527](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L527)

Converts an array of bits into a Uint8Array.
The input bits are grouped into sets of 8, with the first bit in each group being the most significant.

## Parameters

### bits

`number`[]

The input array of bits (each should be 0 or 1). Its length should be a multiple of 8.

## Returns

`Uint8Array`

A Uint8Array constructed from the input bits.
