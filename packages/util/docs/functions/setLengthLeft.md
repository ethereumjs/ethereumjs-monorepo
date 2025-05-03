[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / setLengthLeft

# Function: setLengthLeft()

> **setLengthLeft**(`msg`, `length`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L153)

Left Pads a `Uint8Array` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

## Parameters

### msg

`Uint8Array`

the value to pad

### length

`number`

the number of bytes the output should be

## Returns

`Uint8Array`
