[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / verifyVerkleProof

# Function: verifyVerkleProof()

> **verifyVerkleProof**(`verkleCrypto`, `executionWitness`): `boolean`

Defined in: [packages/util/src/verkle.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L84)

Verifies that the executionWitness is valid for the given prestateRoot.

## Parameters

### verkleCrypto

[`VerkleCrypto`](../interfaces/VerkleCrypto.md)

The [VerkleCrypto](../interfaces/VerkleCrypto.md) foreign function interface object from Verkle cryptography

### executionWitness

[`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

The verkle execution witness.

## Returns

`boolean`

Whether or not the executionWitness belongs to the prestateRoot.
