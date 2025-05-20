[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / getVerkleStem

# Function: getVerkleStem()

> **getVerkleStem**(`verkleCrypto`, `address`, `treeIndex`): `Uint8Array`

Defined in: [packages/util/src/verkle.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L59)

## Parameters

### verkleCrypto

[`VerkleCrypto`](../interfaces/VerkleCrypto.md)

The [VerkleCrypto](../interfaces/VerkleCrypto.md) foreign function interface object from Verkle cryptography

### address

[`Address`](../classes/Address.md)

The address to generate the tree key for.

### treeIndex

The index of the tree to generate the key for. Defaults to 0.

`number` | `bigint`

## Returns

`Uint8Array`

The 31-bytes verkle tree stem as a Uint8Array.

## Dev

Returns the 31-bytes verkle tree stem for a given address and tree index.

## Dev

Assumes that the verkle node width = 256
