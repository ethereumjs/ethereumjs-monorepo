[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getVerkleKey

# Function: getVerkleKey()

> **getVerkleKey**(`stem`, `leaf`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/verkle.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L180)

## Parameters

### stem

`Uint8Array`

The 31-bytes verkle tree stem as a Uint8Array.

### leaf

`Uint8Array`\<`ArrayBufferLike`\> | [`VerkleLeafType`](../type-aliases/VerkleLeafType.md)

## Returns

`Uint8Array`\<`ArrayBufferLike`\>

The tree key as a Uint8Array.

## Dev

Returns the tree key for a given verkle tree stem, and sub index.

## Dev

Assumes that the verkle node width = 256
