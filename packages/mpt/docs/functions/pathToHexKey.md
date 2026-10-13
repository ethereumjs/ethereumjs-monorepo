[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / pathToHexKey

# Function: pathToHexKey()

> **pathToHexKey**(`path`, `extension`, `retType`): `Uint8Array`

Defined in: [util/encoding.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/encoding.ts#L151)

Extend a hex path string with extension nibbles and encode as keybytes or hex bytes.

## Parameters

### path

`string`

Hex path without `0x` prefix

### extension

[`Nibbles`](../type-aliases/Nibbles.md)

Nibbles appended to the path

### retType

`string`

`"hex"` or `"keybyte"` output encoding

## Returns

`Uint8Array`
