[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / arrayContainsArray

# Function: arrayContainsArray()

> **arrayContainsArray**(`superset`, `subset`, `some?`): `boolean`

Defined in: [packages/util/src/internal.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L85)

Return whether `superset` contains every element of `subset`.

When `some` is true, succeed if any subset element is present instead of all.

## Parameters

### superset

`unknown`[]

### subset

`unknown`[]

### some?

`boolean`

## Returns

`boolean`

## Throws

If either argument is not an array
