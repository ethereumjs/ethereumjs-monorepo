[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / concatBytes

# Function: concatBytes()

> **concatBytes**(...`arrays`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:424](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L424)

This mirrors the functionality of the `ethereum-cryptography` export except
it skips the check to validate that every element of `arrays` is indeed a `uint8Array`
Can give small performance gains on large arrays

## Parameters

### arrays

...`Uint8Array`[]

an array of Uint8Arrays

## Returns

`Uint8Array`

one Uint8Array with all the elements of the original set
works like `Buffer.concat`
