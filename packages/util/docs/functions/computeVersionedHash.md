[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / computeVersionedHash

# Function: computeVersionedHash()

> **computeVersionedHash**(`commitment`, `blobCommitmentVersion`): `` `0x${string}` ``

Defined in: [packages/util/src/blobs.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/blobs.ts#L88)

Converts a vector commitment for a given data blob to its versioned hash.  For 4844, this version
number will be 0x01 for KZG vector commitments but could be different if future vector commitment
types are introduced

## Parameters

### commitment

`` `0x${string}` ``

a vector commitment to a blob

### blobCommitmentVersion

`number`

the version number corresponding to the type of vector commitment

## Returns

`` `0x${string}` ``

a versioned hash corresponding to a given blob vector commitment
