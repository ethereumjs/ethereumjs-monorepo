[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / setLengthRight

# Function: setLengthRight()

> **setLengthRight**(`msg`, `length`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L165)

Right Pads a `Uint8Array` with trailing zeros till it has `length` bytes.
it truncates the end if it exceeds.

## Parameters

### msg

`Uint8Array`

the value to pad

### length

`number`

the number of bytes the output should be

## Returns

`Uint8Array`
