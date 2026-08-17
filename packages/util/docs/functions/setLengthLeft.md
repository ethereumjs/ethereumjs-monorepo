[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / setLengthLeft

# Function: setLengthLeft()

> **setLengthLeft**(`msg`, `length`, `opts`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L170)

Left Pads a `Uint8Array` with leading zeros till it has `length` bytes.
Throws if input length exceeds target length, unless allowTruncate option is true.

## Parameters

### msg

`Uint8Array`

the value to pad

### length

`number`

the number of bytes the output should be

### opts

[`SetLengthOpts`](../interfaces/SetLengthOpts.md) = `{}`

options object with allowTruncate flag

## Returns

`Uint8Array`
