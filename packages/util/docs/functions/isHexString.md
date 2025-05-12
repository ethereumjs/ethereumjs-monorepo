[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / isHexString

# Function: isHexString()

> **isHexString**(`value`, `length?`): `` value is `0x${string}` ``

Defined in: [packages/util/src/internal.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L36)

Returns a boolean on whether or not the the input starts with '0x' and matches the optional length

## Parameters

### value

`string`

the string input value

### length?

`number`

the optional length of the hex string in bytes

## Returns

`` value is `0x${string}` ``

Whether or not the string is a valid PrefixedHexString matching the optional length
