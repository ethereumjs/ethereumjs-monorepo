[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / toBytes

# Function: toBytes()

> **toBytes**(`v`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:229](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L229)

Attempts to turn a value into a `Uint8Array`.
Inputs supported: `Buffer`, `Uint8Array`, `String` (hex-prefixed), `Number`, null/undefined, `BigInt` and other objects
with a `toArray()` or `toBytes()` method.

## Parameters

### v

[`ToBytesInputTypes`](../type-aliases/ToBytesInputTypes.md)

the value

## Returns

`Uint8Array`
