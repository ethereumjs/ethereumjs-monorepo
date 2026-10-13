[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToBigInt

# Function: bytesToBigInt()

> **bytesToBigInt**(`bytes`, `littleEndian?`): `bigint`

Defined in: [packages/util/src/bytes.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L59)

Interpret bytes as an unsigned big-endian integer (optionally little-endian).

## Parameters

### bytes

`Uint8Array`

### littleEndian?

`boolean` = `false`

When true, reverse byte order before conversion

## Returns

`bigint`
