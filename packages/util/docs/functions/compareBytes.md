[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / compareBytes

# Function: compareBytes()

> **compareBytes**(`value1`, `value2`): `number`

Defined in: [packages/util/src/bytes.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L407)

Compares two Uint8Arrays and returns a number indicating their order in a sorted array.

## Parameters

### value1

`Uint8Array`

The first Uint8Array to compare.

### value2

`Uint8Array`

The second Uint8Array to compare.

## Returns

`number`

A positive number if value1 is larger than value2,
                  A negative number if value1 is smaller than value2,
                  or 0 if value1 and value2 are equal.
