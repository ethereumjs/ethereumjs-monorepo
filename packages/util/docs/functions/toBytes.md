[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / toBytes

# Function: toBytes()

> **toBytes**(`v`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L234)

Coerce supported JavaScript values to bytes.

Accepts hex strings, numbers, bigints, arrays, objects with `toBytes()`, and null/undefined (empty bytes).

## Parameters

### v

[`ToBytesInputTypes`](../type-aliases/ToBytesInputTypes.md)

## Returns

`Uint8Array`

## Throws

On invalid strings, negative bigints, or unsupported types
