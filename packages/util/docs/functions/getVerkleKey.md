[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getVerkleKey

# Function: getVerkleKey()

> **getVerkleKey**(`stem`, `leaf`): `Uint8Array`

Defined in: [packages/util/src/verkle.ts:179](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L179)

## Parameters

### stem

`Uint8Array`

The 31-bytes verkle tree stem as a Uint8Array.

### leaf

`Uint8Array` | [`VerkleLeafType`](../enumerations/VerkleLeafType.md)

## Returns

`Uint8Array`

The tree key as a Uint8Array.

## Dev

Returns the tree key for a given verkle tree stem, and sub index.

## Dev

Assumes that the verkle node width = 256
