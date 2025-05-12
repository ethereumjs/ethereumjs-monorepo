[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / verifyBinaryProof

# Function: verifyBinaryProof()

> **verifyBinaryProof**(`rootHash`, `key`, `proof`): `Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [proof.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/proof.ts#L34)

Verifies a proof.

## Parameters

### rootHash

`Uint8Array`

### key

`Uint8Array`

### proof

`Uint8Array`\<`ArrayBufferLike`\>[]

## Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

The value from the key, or null if valid proof of non-existence.

## Throws

If proof is found to be invalid.
