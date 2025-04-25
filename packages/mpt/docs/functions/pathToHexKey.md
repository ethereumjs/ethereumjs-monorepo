[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / pathToHexKey

# Function: pathToHexKey()

> **pathToHexKey**(`path`, `extension`, `retType`): `Uint8Array`

Defined in: [packages/mpt/src/util/encoding.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/encoding.ts#L150)

Takes a string path and extends it by the given extension nibbles

## Parameters

### path

`string`

String node path

### extension

[`Nibbles`](../type-aliases/Nibbles.md)

nibbles to extend by

### retType

`string`

string indicating whether to return the key in "keybyte" or "hex" encoding

## Returns

`Uint8Array`

hex-encoded key
