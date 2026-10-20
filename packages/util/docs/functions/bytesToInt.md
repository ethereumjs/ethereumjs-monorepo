[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToInt

# Function: bytesToInt()

> **bytesToInt**(`bytes`): `number`

Defined in: [packages/util/src/bytes.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L83)

Interpret bytes as an unsigned big-endian integer and coerce to a safe JS number.

## Parameters

### bytes

`Uint8Array`

## Returns

`number`

## Throws

If the value exceeds 53 bits
